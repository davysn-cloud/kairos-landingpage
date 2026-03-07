import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.warn("[Storage] SUPABASE_URL or SUPABASE_SERVICE_KEY not configured");
    return null;
  }
  supabase = createClient(url, key);
  return supabase;
}

const BUCKET = "art-files";

export async function uploadArtFile({
  buffer,
  mimetype,
  originalname,
  orderId,
  orderItemId,
}: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  orderId: string;
  orderItemId: string;
}): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("Supabase Storage não configurado");

  const timestamp = Date.now();
  const safeName = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `orders/${orderId}/${orderItemId}/${timestamp}-${safeName}`;

  const { error } = await client.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimetype,
    upsert: false,
  });

  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const PRODUCT_BUCKET = "product-images";

export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
  mimetype: string,
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("Supabase Storage não configurado");

  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${timestamp}-${safeName}`;

  const { error } = await client.storage.from(PRODUCT_BUCKET).upload(path, buffer, {
    contentType: mimetype,
    upsert: false,
  });

  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const { data } = client.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const client = getClient();
  if (!client) return;

  // Extract path from full URL — the path is after /object/public/product-images/
  const marker = `/object/public/${PRODUCT_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = url.substring(idx + marker.length);
  await client.storage.from(PRODUCT_BUCKET).remove([path]);
}

export async function getSignedArtUrl(filePath: string): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("Supabase Storage não configurado");

  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 3600); // 1 hour

  if (error || !data?.signedUrl) throw new Error(`Signed URL falhou: ${error?.message}`);
  return data.signedUrl;
}
