const fs = require('fs-extra');
const shell = require('shelljs');
// console.log(process.argv);
process.env.path += ';./node_modules/.bin';

let args = process.argv.slice(3);
if ( args.filter(i => i === 'compile=debug')[0] ) {
	debug();
} else if ( args.filter(i => i === 'compile=release')[0] ) {
	release();
}
if ( args.includes('libs') ) libs();


function libs() {
	require('./libs.js').forEach(i => {
		shell.cp('-r', `./node_modules/${i}`, './src/lib/');
	});
};

function debug() {
	const INP = './src';
	const OUT = './dist';
	const ROOT = '';
	
	shell.rm('-rf', OUT);
	shell.mkdir('-p', OUT+'/css', OUT+'/js');
	shell.cp('-r', INP+'/lib', INP+'/images', INP+'/fonts', OUT);
	shell.mv(OUT+'/images/favicon.ico', OUT);

	fs.writeFileSync(INP+'/html/links/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/filename.htm', 'main.js');
	fs.writeFileSync(INP+'/js/core/root.js', "export default '';", );

	shell.exec(`htmlbilder ${INP}/html/ -o ${OUT}/index.html`);
	shell.exec(`handlebars ${INP}/templates/template/ -f ${OUT}/js/templates.js -e hbs -o`);
	shell.exec(`handlebars ${INP}/templates/partial/ -f ${OUT}/js/partials.js -p -e hbs -o`);
	shell.exec(`babel ${INP}/js/ -d ${OUT}/js -s`);
	shell.exec(`sass ${INP}/sass/style.scss:${OUT}/css/style.css`);
}

function release() {
	const INP = './src';
	const OUT = './release/static';
	const ROOT = '/static/';
	const FL = 'app.bundle.js';
	
	shell.rm('-rf', OUT);
	shell.mkdir('-p', OUT+'/css', OUT+'/js');
	shell.cp('-r', INP+'/lib', INP+'/images', INP+'/fonts', OUT);
	shell.mv(OUT+'/images/favicon.ico', OUT);

	fs.writeFileSync(INP+'/html/links/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/root.htm', ROOT);
	fs.writeFileSync(INP+'/html/scripts/app/filename.htm', FL);
	fs.writeFileSync(INP+'/js/core/root.js', "export default '${ROOT}';");

	shell.exec(`htmlbilder ${INP}/html/ -o ./release/index.html`);
	
	const TEMPLATES_FILE = `${OUT}/js/templates.tmp.js`;
	const PARTIALS_FILE = `${OUT}/js/partials.tmp.js`;
	shell.exec(`handlebars ${INP}/templates/template/ -f ${TEMPLATES_FILE} -e hbs -m -o`);
	shell.exec(`handlebars ${INP}/templates/partial/ -f ${PARTIALS_FILE} -p -e hbs -m -o`);
	fs.writeFileSync( `${OUT}/js/templates.js`, shell.cat(TEMPLATES_FILE, PARTIALS_FILE) );
	shell.rm('-rf', TEMPLATES_FILE, PARTIALS_FILE);
	
	const DIR = `${OUT}/js/`;
	const FILE = `${OUT}/${FL}`;
	const FILE2 = `${OUT}/js/${FL}`;
	shell.exec(`babel ${INP}/js/ -d ${DIR}`);
	shell.exec(`r_js -o baseUrl=${OUT}/js/ name=main out=${FILE} optimize=uglify`); // optimize=none
	shell.rm('-rf', DIR);
	shell.exec(`babel ${INP}/js/workers/ -d ${OUT}/js/workers/ --minified`); // --minified
	shell.mv(FILE, DIR); // above babel command creates the necessary dir
	fs.writeFileSync(FILE2, fs.readFileSync(FILE2, 'utf-8')+"require(['main']);"); // '\n'
	
	shell.exec(`sass ${INP}/sass/style.scss:${OUT}/css/style.css --style=compressed --no-source-map`);
};