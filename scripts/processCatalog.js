// Script to process the Hilti product catalog
// Run with: node scripts/processCatalog.js

const fs = require('fs');
const path = require('path');

// Extract and process the product catalog
async function processCatalog() {
  try {
    console.log('🔄 Processing Hilti product catalog...');
    
    // Check if catalog is already extracted
    const catalogDir = path.join(__dirname, '../product_data_en_us');
    if (!fs.existsSync(catalogDir)) {
      console.log('📦 Extracting product catalog...');
      // In a real implementation, you'd extract the zip here
      console.log('⚠️  Please extract product_data_en_us.zip manually first');
      return;
    }

    // Read all JSON files
    const files = fs.readdirSync(catalogDir).filter(file => file.endsWith('.json'));
    console.log(`📁 Found ${files.length} product files`);

    // Process first 100 files as a sample
    const sampleSize = Math.min(100, files.length);
    const products = [];

    for (let i = 0; i < sampleSize; i++) {
      const filePath = path.join(catalogDir, files[i]);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const product = JSON.parse(content);
        products.push(product);
      } catch (error) {
        console.warn(`⚠️  Failed to parse ${files[i]}:`, error.message);
      }
    }

    console.log(`✅ Processed ${products.length} products`);

    // Create a simplified catalog for the app
    const simplifiedCatalog = products.map(product => ({
      sku: product.tag_sku,
      name: product.tag_name,
      description: product.tag_description,
      category: product.tag_categories_leaf,
      url: product.tag_public_url,
      content: product.content.substring(0, 1000) // Truncate for size
    }));

    // Save processed catalog
    const outputPath = path.join(__dirname, '../src/data/hiltiCatalog.json');
    fs.writeFileSync(outputPath, JSON.stringify(simplifiedCatalog, null, 2));
    
    console.log(`💾 Saved processed catalog to ${outputPath}`);
    console.log(`📊 Sample products:`);
    
    // Show sample products
    simplifiedCatalog.slice(0, 5).forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - ${product.category}`);
    });

    // Generate categories summary
    const categories = [...new Set(simplifiedCatalog.map(p => p.category))];
    console.log(`\n📋 Categories found: ${categories.length}`);
    categories.slice(0, 10).forEach(cat => {
      const count = simplifiedCatalog.filter(p => p.category === cat).length;
      console.log(`  - ${cat}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error processing catalog:', error);
  }
}

// Run the processing
processCatalog();
