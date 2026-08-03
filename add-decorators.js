const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not installed? I'll use child_process find

const { execSync } = require('child_process');

const files = execSync('find src/apis -name "*.dto.ts"').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  let imports = new Set();
  
  // Find properties like: propName?: type; or propName: type;
  const propertyRegex = /(\s+)([a-zA-Z0-9_]+)(\??)\s*:\s*([^;]+);/g;
  
  content = content.replace(propertyRegex, (match, space, name, optional, typeStr) => {
    let decorators = [];
    
    if (optional === '?') {
      decorators.push('@IsOptional()');
      imports.add('IsOptional');
    }
    
    typeStr = typeStr.trim();
    if (typeStr === 'string') {
      decorators.push('@IsString()');
      imports.add('IsString');
    } else if (typeStr === 'number') {
      // In DTOs, numeric fields might come as strings if they are from query or formdata,
      // but transform: true handles conversion. Type is number.
      decorators.push('@IsNumber()');
      imports.add('IsNumber');
    } else if (typeStr === 'boolean') {
      decorators.push('@IsBoolean()');
      imports.add('IsBoolean');
    } else if (typeStr === 'number[]') {
      decorators.push('@IsArray()');
      decorators.push('@IsNumber({}, { each: true })');
      imports.add('IsArray');
      imports.add('IsNumber');
    } else if (['ProductStatus', 'OrderStatus', 'UserStatus'].includes(typeStr)) {
      decorators.push(`@IsEnum(${typeStr})`);
      imports.add('IsEnum');
    }

    if (decorators.length > 0) {
      return `${space}${decorators.join(space)}${space}${name}${optional}: ${typeStr};`;
    }
    return match;
  });

  if (imports.size > 0 && content !== original) {
    const importStr = `import { ${Array.from(imports).join(', ')} } from 'class-validator';\n`;
    content = importStr + content;
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated:', file);
  }
}
