'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleLike(glowId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Must be logged in to like');
  }

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('glow_id', glowId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    // Unlike
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
  } else {
    // Like
    await supabase
      .from('likes')
      .insert({ glow_id: glowId, user_id: user.id });
  }

  revalidatePath('/');
}

export async function addComment(glowId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Must be logged in to comment');
  }

  if (!content || content.trim() === '') {
    throw new Error('Comment cannot be empty');
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      glow_id: glowId,
      user_id: user.id,
      content: content.trim()
    });

  if (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }

  revalidatePath('/');
}

export async function getComments(glowId: string) {
  const supabase = await createClient();
  
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      profiles ( username )
    `)
    .eq('glow_id', glowId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return comments;
}
