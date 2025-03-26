'use server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

// 增加计数并记录访问
export async function incrementAndLog() {
  const cf = await getCloudflareContext()
  const headersList = headers()
  
  try {
    // First, ensure both tables exist
    await cf.env.DB.exec(`
      CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER);
      INSERT OR IGNORE INTO counters (name, value) VALUES ('page_views', 0);
      
      CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        path TEXT,
        accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    // Increment the counter
    await cf.env.DB.prepare('UPDATE counters SET value = value + 1 WHERE name = ?')
      .bind('page_views')
      .run()
    
    // Get the updated count
    const { results: count } = await cf.env.DB.prepare('SELECT value FROM counters WHERE name = ?')
      .bind('page_views')
      .all()
    
    // Log the access
    await cf.env.DB.prepare('INSERT INTO access_logs (ip, path, accessed_at) VALUES (?, ?, datetime())')
      .bind(
        headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
        headersList.get('x-forwarded-host') || '/'
      )
      .run()
    
    // Get recent access logs
    const { results: recentAccess } = await cf.env.DB.prepare('SELECT * FROM access_logs ORDER BY accessed_at DESC LIMIT 5')
      .all()
    
    return { 
      count: count[0]?.value || 0,
      recentAccess: recentAccess || []
    }
  } catch (error) {
    console.error('Error in incrementAndLog:', error)
    return { 
      count: 0,
      recentAccess: []
    }
  }
}


// 获取当前计数和最近访问
export async function getStats() {
  const cf = await getCloudflareContext()
  
  try {
    // First, ensure the table exists
    await cf.env.DB.exec(`
      CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER);
      INSERT OR IGNORE INTO counters (name, value) VALUES ('page_views', 0);
    `)
    
    // Then query the table
    const { results: count } = await cf.env.DB.prepare('SELECT value FROM counters WHERE name = ?')
      .bind('page_views')
      .all()
    
    return { pageViews: count[0]?.value || 0 }
  } catch (error) {
    console.error('Error in getStats:', error)
    // Return a default value to prevent the application from crashing
    return { pageViews: 0 }
  }
}
