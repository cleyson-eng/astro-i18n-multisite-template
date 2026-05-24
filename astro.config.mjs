// @ts-check
import { defineConfig } from 'astro/config';
import { domainAsVarName, domainFullHttps } from './build-scripts/sitemap_data';
import { siteDomains } from './src/meta/sitemap';
import pages from 'astro-pages';
import compress from '@playform/compress';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import basicSsl from '@vitejs/plugin-basic-ssl';

import { DOMAIN, DEBUG, _noCDNAssets } from './build-scripts/util';

import * as fs from "node:fs";
import * as path from "node:path";
function noCDNASave(){
	if (DEBUG) return;
	const out = path.resolve(import.meta.dirname,'build/'+domainAsVarName(DOMAIN)+".noCDN.txt");
	const keys = Array.from(_noCDNAssets.keys());
	if (keys.length > 0) {
		fs.writeFileSync(out, keys.join('\n'));
	}
}

export default defineConfig({
	output: 'static',
	outDir: DEBUG?'build':('build/'+domainAsVarName(DOMAIN)),
	site: DEBUG?undefined:domainFullHttps(DOMAIN),
	base: '/',
	//trailingSlash: "always",
	compressHTML: false,//disable vite minify use just the @platform/compress (better)
	build:{
		assets: 'a',//output dir
		assetsPrefix: DEBUG?undefined:domainFullHttps(siteDomains[0]),
		format: 'file'
	},
	integrations: [
		pages('pages_redirect/'+(DEBUG?'debug':domainAsVarName(DOMAIN))),
		compress({
			Logger: 1,
			Image: false,
			HTML: {
				"html-minifier-terser":{
					removeAttributeQuotes: false,
					sortAttributes: false,
					removeComments:true,
				},
				//@ts-ignore legacy
				removeComments: true,
				removeAttributeQuotes: false,
				minifyJS: true,
				minifyCSS: true,
				collapseWhitespace: true,
				keepClosingSlash: true,
				removeOptionalTags: false
			},
			JavaScript: true,
			CSS:{
				engine: 'lightningcss',
				lightningcss: {
					minify: true,
					drafts: {
						customMedia: true,
						//@ts-ignore legacy
						nesting: true
					},
					targets: browserslistToTargets(browserslist('> 0.2%, not dead'))
				},
				csso:false,
			},
		}),
		{
			name: 'save-noCDNAssets-after-build',
			hooks: { 'astro:build:generated': noCDNASave },
		}
	],
	vite: {
		plugins: [  basicSsl() ],
		//@ts-ignore legacy basicSsl
		server: {  https: true },
		resolve:{
			preserveSymlinks:true,
		},
		build: {
			assetsInlineLimit: 0,
			sourcemap:false,
			//@ts-ignore legacy
      		showSourcemap: false,
			minify: false,//disable vite minify use just the @platform/compress (better)
		}
	}
});
