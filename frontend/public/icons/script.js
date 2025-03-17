const fs = require('fs');
const path = require('path');

/**
 * Convert SVG files in a folder to React components in a single JS file
 * Removes comments and properly handles style elements.
 * @param {string} svgFolder - Path to folder containing SVG files
 * @param {string} outputFile - Path to output JS file
 */
function convertSvgToJsComponents(svgFolder, outputFile) {
  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Get list of SVG files
  const svgFiles = fs.readdirSync(svgFolder)
    .filter(file => file.endsWith('.svg'));
  
  const components = [];
  const exportNames = [];
  
  svgFiles.forEach(svgFile => {
    // Read SVG content
    let svgContent = fs.readFileSync(path.join(svgFolder, svgFile), 'utf8');
    
    // Remove XML comments
    svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // Fix style tags - make sure quotes are properly escaped
    svgContent = svgContent.replace(
      /(<style[^>]*>)([\s\S]*?)(<\/style>)/g,
      (match, openTag, styleContent, closeTag) => {
        // Escape quotes inside style content
        const escapedStyleContent = styleContent.replace(/"/g, '\\"');
        return openTag + escapedStyleContent + closeTag;
      }
    );
    
    // Create component name from file name
    let componentName = path.basename(svgFile, '.svg')
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // Ensure component name starts with a letter
    if (!/^[a-zA-Z]/.test(componentName)) {
      componentName = 'Svg' + componentName;
    }
    
    // Create React component
    const reactComponent = `export const ${componentName} = () => {
  return (
    ${svgContent}
  );
};`;
    
    components.push(reactComponent);
    exportNames.push(componentName);
  });
  
  // Combine all components
  const outputContent = components.join('\n\n') + 
    '\n\nexport default {\n  ' + 
    exportNames.join(',\n  ') + 
    '\n};';
  
  // Write to single output file
  fs.writeFileSync(outputFile, outputContent);
  
  console.log(`Converted ${svgFiles.length} SVG files to components in ${outputFile}`);
}

// Example usage
const svgFolder = './duotone-thin';  // Replace with your SVG folder path
const outputFile = './components/SvgIcons.tsx';  // Replace with your desired output file

convertSvgToJsComponents(svgFolder, outputFile);

// 35214291