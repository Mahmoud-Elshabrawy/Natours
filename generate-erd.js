const { generate } = require('mongoose-erd-generator');
const path = require('path');

const modelsPath = path.join(__dirname, 'models'); 

generate({
  path: modelsPath,           
  output: 'schema.svg',     
  format: 'svg'          
}).then(() => {
  console.log('✅ ERD generated successfully!');
}).catch(err => {
  console.error('❌ Error generating ERD:', err);
});
