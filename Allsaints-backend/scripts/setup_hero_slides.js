const mysql = require('../node_modules/mysql2/promise');

async function setup() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'allsaints',
    });

    console.log('Connected to MySQL allsaints');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`hero_slides\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`image_url\` VARCHAR(500) NOT NULL,
        \`title\` VARCHAR(200) NOT NULL DEFAULT 'All Saints Public School Campus',
        \`caption\` VARCHAR(300) NULL,
        \`display_order\` INT NOT NULL DEFAULT 1,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [existing] = await conn.query('SELECT COUNT(*) as cnt FROM hero_slides');
    if (existing[0].cnt === 0) {
      await conn.query(`
        INSERT INTO \`hero_slides\` (\`image_url\`, \`title\`, \`caption\`, \`display_order\`) VALUES
        ('/images/home_slider/slider-1.jpg', 'All Saints Public School Campus', 'CBSE Affiliated (930501) · LKG to Class XII · Pannivizha, Adoor', 1),
        ('/images/home_slider/slider-2.jpg', 'Eco-Friendly Lush Green Grounds', 'Spacious Campus, Play Arenas & High-Tech Smart Classrooms', 2),
        ('/images/home_slider/slider-3.jpg', 'Nurturing Mind, Body & Spirit', 'To Create Creators · Holistic Academic & Moral Excellence', 3),
        ('/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg', 'State-of-the-Art Infrastructure', 'Future-Ready Learning with 100% CBSE Success Record', 4);
      `);
      console.log('Seeded 4 default hero slides.');
    } else {
      console.log('hero_slides already has rows:', existing[0].cnt);
    }

    const [rows] = await conn.query('SELECT id, image_url, title, display_order FROM hero_slides');
    console.log('Hero slides count:', rows.length);
    console.table(rows);
    await conn.end();
  } catch (err) {
    console.error('Error setting up hero_slides:', err);
  }
}

setup();
