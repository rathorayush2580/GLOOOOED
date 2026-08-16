'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGlow(content: string, color: string) {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to post a Glow.');
  }

  // Basic validation
  if (!content || content.trim() === '') {
    throw new Error('Glow content cannot be empty.');
  }

  if (content.length > 280) {
    throw new Error('Glow content must be 280 characters or less.');
  }

  const validColors = ['yellow', 'pink', 'blue', 'green', 'purple'];
  const finalColor = validColors.includes(color) ? color : 'yellow';

  // Insert Glow
  const { error } = await supabase
    .from('glows')
    .insert({
      user_id: user.id,
      content: content.trim(),
      color: finalColor,
    });

  if (error) {
    throw new Error(`Failed to create Glow: ${error.message}`);
  }

  // Refresh feed
  revalidatePath('/');
}

export async function getGlows() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Glows with author's username, total likes, total comments, and whether the current user liked it
  const { data: glows, error } = await supabase
    .from('glows')
    .select(`
      id,
      content,
      color,
      created_at,
      user_id,
      profiles ( username ),
      likes ( id, user_id ),
      comments ( id )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching glows:', error);
    return [];
  }

  // Map the results to a cleaner format with counts
  return glows.map((glow: any) => ({
    ...glow,
    likesCount: glow.likes ? glow.likes.length : 0,
    commentsCount: glow.comments ? glow.comments.length : 0,
    isLikedByMe: user ? glow.likes?.some((like: any) => like.user_id === user.id) : false,
    likes: undefined, // remove raw arrays from payload
    comments: undefined
  }));
}
