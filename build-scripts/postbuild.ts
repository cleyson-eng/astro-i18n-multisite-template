import { siteDomains } from "../src/meta/sitemap.ts";
import { domainAsVarName } from "./sitemap_data.ts";
import * as path from "node:path";
import * as fs from "node:fs";

/*
Uses the sitemap_data "on exit" .noCDN.txt file
to filter what file is not for "cdn in main site"
*/
const root = path.resolve(import.meta.dirname as string,'..');
function fixCDN () {
	if (siteDomains.length <= 1) return;
	const cdn_path = path.resolve(root,'build/' + domainAsVarName(siteDomains[0]),'a');
	siteDomains
		.filter((_,i)=>i!=0)
		.map((x)=> path.resolve(root,'build/' + domainAsVarName(x)))
		.forEach((domainpath)=>{
			const nocdn_path = domainpath + '.noCDN.txt';
			let filter:string[] = fs.existsSync(nocdn_path)?fs.readFileSync(nocdn_path,'utf-8').split('\n'):[];
			const files = fs.readdirSync(path.resolve(domainpath, 'a'))
				.filter((cfile)=>
					filter.findIndex((cfilter)=>
						cfile==cfilter
					)<0
				);
			files.forEach((cfile)=>{
				const src = path.resolve(domainpath, 'a', cfile),
					dst = path.resolve(cdn_path, cfile);
				console.log({src,dst});
				if (fs.existsSync(dst))
					fs.rmSync(src);
				else
					fs.renameSync(src, dst);
			});
		});
}
fixCDN();