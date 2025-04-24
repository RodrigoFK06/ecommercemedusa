const fs = require('fs');
const path = require('path');

const entryFilePath = path.join(__dirname, '.medusa', 'client', 'entry.jsx');

function fixEntry() {
  if (fs.existsSync(entryFilePath)) {
    let entryContent = fs.readFileSync(entryFilePath, 'utf-8');
    entryContent = entryContent.replace(/@lambdacurry\\medusa-product-reviews\\admin/g, '@lambdacurry/medusa-product-reviews/admin');
    fs.writeFileSync(entryFilePath, entryContent, 'utf-8');
    console.log('✅ entry.jsx corregido exitosamente.');
    process.exit(0);
  } else {
    console.log('⏳ entry.jsx aún no existe. Intentando nuevamente en 2 segundos...');
    setTimeout(fixEntry, 2000);
  }
}

fixEntry();
