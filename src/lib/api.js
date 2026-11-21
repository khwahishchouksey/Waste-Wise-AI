// src/lib/api.js
// All Supabase calls for WasteWise live here.
// Components import these functions instead of touching localStorage.

import { supabase } from './supabaseClient';

/* ------------------------------------------------------------------ */
/* Helpers: convert database rows into the shape the components use    */
/* ------------------------------------------------------------------ */

const mapProfile = (row) =>
  row
    ? {
        id: row.id, // users.id (database id)
        authId: row.auth_id,
        studentId: row.student_id,
        name: row.name,
        email: row.email,
        role: row.role,
        department: row.department,
        hostel: row.hostel,
        avatar:
          row.avatar_url ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.name || 'User')}`,
        ecoPoints: row.eco_points,
        scansCount: row.scan_count,
      }
    : null;

const mapReport = (row) => ({
  id: row.report_code, // shown as RPT-1004
  dbId: row.id, // real uuid, used for updates
  title: row.title,
  category: row.category,
  severity: row.urgency,
  location: row.location,
  description: row.description,
  imageUrl:
    row.photo_url ||
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
  status: row.status,
  adminNotes: row.staff_note || '',
  assignedTeam: row.assigned_team || '',
  reportedBy: row.reporter?.name || 'Unknown',
  timestamp: row.created_at,
});

/* ------------------------------------------------------------------ */
/* AUTH                                                                */
/* ------------------------------------------------------------------ */

// Create a new student account. The database trigger creates the profile
// row and gives +100 welcome points.
export async function signUp({ name, email, password, studentId, department, hostel }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
        student_id: studentId.trim(),
        department,
        hostel,
      },
    },
  });
  if (error) return { success: false, message: error.message };

  // If "Confirm email" is ON in Supabase, there is no session yet.
  if (!data.session) {
    return {
      success: false,
      message: 'Account created. Please confirm your email, then sign in.',
    };
  }
  const user = await getCurrentProfile();
  return { success: true, user };
}

export async function signIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { success: false, message: error.message };

  const user = await getCurrentProfile();
  if (!user) {
    return { success: false, message: 'Signed in, but no profile was found for this account.' };
  }
  return { success: true, user };
}

export async function signOut() {
  await supabase.auth.signOut();
}

// Returns the logged-in user's profile (or null if nobody is logged in).
export async function getCurrentProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('getCurrentProfile:', error.message);
    return null;
  }
  return mapProfile(data);
}

/* ------------------------------------------------------------------ */
/* REPORTS                                                             */
/* ------------------------------------------------------------------ */

// Students get their own reports; admins get all reports (enforced by RLS).
export async function fetchReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, reporter:users(name, student_id)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchReports:', error.message);
    return [];
  }
  return data.map(mapReport);
}

// `file` is an optional File object from the photo input.
export async function createReport({ title, category, urgency, location, description, file }) {
  let photoUrl = null;

  if (file) {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${uid}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from('report-photos')
      .upload(path, file, { contentType: file.type });

    if (upErr) return { success: false, message: `Photo upload failed: ${upErr.message}` };
    photoUrl = supabase.storage.from('report-photos').getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({
      title,
      category,
      urgency,
      location,
      description,
      photo_url: photoUrl,
    })
    .select('*, reporter:users(name, student_id)')
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, report: mapReport(data) };
}

// Admin only. Pass any of: status, adminNotes, assignedTeam.
export async function updateReport(dbId, { status, adminNotes, assignedTeam }) {
  const changes = {};
  if (status !== undefined) changes.status = status;
  if (adminNotes !== undefined) changes.staff_note = adminNotes;
  if (assignedTeam !== undefined) changes.assigned_team = assignedTeam;

  const { data, error } = await supabase
    .from('reports')
    .update(changes)
    .eq('id', dbId)
    .select('*, reporter:users(name, student_id)')
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, report: mapReport(data) };
}

/* ------------------------------------------------------------------ */
/* SCANS + BADGES                                                      */
/* ------------------------------------------------------------------ */

// Saves a scan. The database trigger adds +20 points, +1 scan count, and badges.
export async function saveScan({ item, category, confidence,co2SavedKg }) {
  const { error } = await supabase.from('scans').insert({
    item,
    category,
    confidence: confidence == null ? null : Number(Number(confidence).toFixed(2)),
    co2_saved_kg: Number(co2SavedKg) || 0,
  });
  if (error) return { success: false, message: error.message };

  const user = await getCurrentProfile(); // updated points / scan count
  return { success: true, user };
}

export async function fetchBadges() {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_name, unlocked_at');
  if (error) {
    console.error('fetchBadges:', error.message);
    return [];
  }
  return data.map((b) => ({ name: b.badge_name, unlockedAt: b.unlocked_at }));
}
// Saves a user's category correction. The database adds +10 points the first time per item.
export async function saveCorrection({ detectedLabel, category }) {
  const { error } = await supabase.from('ai_corrections').insert({
    detected_label: detectedLabel.toLowerCase().trim(),
    category,
  });
  // 23505 = this item was already corrected before. Not an error, just no extra points.
  if (error && error.code !== '23505') return { success: false, message: error.message };

  const user = await getCurrentProfile();
  return { success: true, user };
}
// Admin sign-up: creates the account (or signs in if the email already exists),
// then asks the database to promote it using the passkey.
export async function signUpAdmin({ name, email, password, staffId, department, passkey }) {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: { data: { name: name.trim(), student_id: staffId.trim(), department } },
  });

  if (error) {
    const exists = error.code === 'user_already_exists' || /already registered/i.test(error.message);
    if (!exists) return { success: false, message: error.message };
    // Account exists already (e.g. a student, or an earlier wrong-passkey try): sign in instead
    const signedIn = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (signedIn.error) {
      return { success: false, message: 'An account with this email already exists. Enter its correct password.' };
    }
  } else if (!data.session) {
    return { success: false, message: 'Account created. Please confirm your email, then use Admin Sign Up again.' };
  }

  const { data: ok, error: rpcError } = await supabase.rpc('claim_admin', { p_code: passkey.trim() });
  if (rpcError || !ok) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: rpcError
        ? rpcError.message
        : 'Incorrect admin passkey. Your account exists as a student; you can retry here with the same details.',
    };
  }

  const user = await getCurrentProfile();
  return { success: true, user };
}