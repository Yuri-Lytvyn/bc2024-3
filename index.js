const { program } = require('commander');
const fs = require('fs');

program
  .option('-i, --input <path>', 'path to input file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display result in console')
  .parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Please, specify the input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

try {
  const data = fs.readFileSync(options.input, 'utf-8');
  const jsonData = JSON.parse(data);

  const filteredData = jsonData
  .filter(item => item.parent === 'BS3_BanksLiab')
  .map(item => `${item.txten}: ${item.value}`) 
  .join('\n');

  if (filteredData.length === 0) {
    console.log("No items found.");
  } else {

    if (options.output) {
      fs.writeFileSync(options.output, filteredData);
      console.log(`The result is saved to a file: ${options.output}`);
    }

    if (options.display) {
      console.log(filteredData);
    }

    if (!options.output && !options.display) {
      console.log('No parameter specified.');
    }
  }
} catch (error) {
  console.error('Error while processing the file:', error.message);
  process.exit(1);
}