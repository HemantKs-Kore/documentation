import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class ConvertMDtoHTML {
  public _window = window;
  public  detectScriptTag = /<script\b[^>]*>([\s\S]*?)/gm;
  public  helpers = {
     xssAttack(txtStr: string) {
        //   if (compObj && compObj[0] && compObj[0].componentType === "text") {
         const escapeHTML =  (str)=> {
             // '&': '&amp;',
             const escapeTokens = {
                 '<': '&lt;',
                 '>': '&gt;',
                 '"': '&quot;',
                 '\'': '&#x27;'
             };
             const htmlTags = /[<>"']/g;
             return ('' + str).replace(htmlTags, (match)=> {
                 return escapeTokens[match];
             });
         };
        let textHasXSS: { isValid: any; };
        if (txtStr) {
            textHasXSS = this.isNotAllowedHTMLTags(txtStr);
        }
        if (textHasXSS && !textHasXSS.isValid) {
            txtStr = escapeHTML(txtStr);
        }
        return txtStr;
    },
    isEven (n: number) {
        n = Number(n);
        return n === 0 || !!(n && !(n % 2));
    },
     replaceAll (search: string | RegExp, replacement: any, str) {
        const target = str;
        return target.replace(new RegExp(search, 'g'), replacement);
    },
    nl2br (str: string, runEmojiCheck: boolean) {
        // if (runEmojiCheck && this._window.emojione) {
        //     str = this._window.emojione.shortnameToImage(str);
        // }
        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return str;
    },
    br2nl (str: string) {
        str = str.replace(/<br \/>/g, '\n');
        return str;
    },
    formatAMPM (date: Date) {
        let hours:any = date.getHours();
        let minutes:any = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ':'+ seconds + ' ' + ampm;
        return strTime;
    },
    formatDate (date: string | number | Date) {
        let d = new Date(date);
        if ( isNaN( d.getTime() ) ) {
            const _tmpDate = new Date().getTime();
            d = new Date(_tmpDate);
        }
        return d.toDateString() + ' at ' + this.formatAMPM(d);
    },
    isNotAllowedHTMLTags (str) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = str;
        const setFlags = {
            isValid: true,
            key: ''
        };
        try {
            if ($(wrapper).find('script').length || $(wrapper).find('video').length || $(wrapper).find('audio').length) {
                setFlags.isValid = false;
            }
            if ($(wrapper).find('link').length && $(wrapper).find('link').attr('href').indexOf('script') !== -1) {
                if (this.detectScriptTag.test($(wrapper).find('link').attr('href'))) {
                    setFlags.isValid = false;
                } else {
                    setFlags.isValid = true;
                }
            }
            if ($(wrapper).find('a').length && $(wrapper).find('a').attr('href').indexOf('script') !== -1) {
                if (this.detectScriptTag.test($(wrapper).find('a').attr('href'))) {
                    setFlags.isValid = false;
                } else {
                    setFlags.isValid = true;
                }
            }
            if ($(wrapper).find('img').length && $(wrapper).find('img').attr('src').indexOf('script') !== -1) {
                if (this.detectScriptTag.test($(wrapper).find('img').attr('href'))) {
                    setFlags.isValid = false;
                } else {
                    setFlags.isValid = true;
                }
            }
            if ($(wrapper).find('object').length) {
                setFlags.isValid = false;
            }
            return setFlags;
        }
        catch(e){
            return setFlags;
        }
    },
    convertMDtoHTML (val: string, responseType: string) {
        const hyperLinksMap :any={};
        const mdre :any= {};
        // mdre.date = new RegExp(/\\d\(\s*(.{10})\s*\)/g);
        mdre.date = new RegExp(/\\d\(\s*(.{10})\s*(?:,\s*["'](.+?)["']\s*)?\)/g);
        mdre.time = new RegExp(/\\t\(\s*(.{8}\.\d{0,3})\s*\)/g);
        // mdre.datetime = new RegExp(/\\dt\(\s*(.{10})[T](.{12})([z]|[Z]|[+-]\d{4})\s*\)/g);
        mdre.datetime = new RegExp(/\\(d|dt|t)\(\s*([-0-9]{10}[T][0-9:.]{12})([z]|[Z]|[+-]\d{4})[\s]*,[\s]*["']([a-zA-Z\W]+)["']\s*\)/g);
        mdre.num = new RegExp(/\\#\(\s*(\d*.\d*)\s*\)/g);
        mdre.curr = new RegExp(/\\\$\((\d*.\d*)[,](\s*[\"\']\s*\w{3}\s*[\"\']\s*)\)|\\\$\((\d*.\d*)[,](\s*\w{3}\s*)\)/g);

        const regEx:any = {};
        regEx.SPECIAL_CHARS = /[\=\`\~\!@#\$\%\^&\*\(\)_\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
        regEx.EMAIL = /^[-a-z0-9~!$%^&*_=+}{\']+(\.[-a-z0-9~!$%^&*_=+}{\']+)*@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,255})+$/i;
        regEx.MENTION = /(^|\s|\\n|")@([^\s]*)(?:[\s]\[([^\]]*)\])?["]?/gi;
        regEx.HASHTAG = /(^|\s|\\n)#(\S+)/g;
        regEx.NEWLINE = /\n/g;
        const _regExForLink = /((?:http\:\/\/|https\:\/\/|www\.)+\S*\.(?:(?:\.\S)*[^\,\s\.])*\/?)/gi;
       // var _regExForMarkdownLink = /\[([^\]]+)\](|\s)+\(([^\)])+\)/g;
       const _regExForMarkdownLink = /\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)?/g;
        let str:any = val || '';
        const mmntns:any = {};
        mmntns.sd = new RegExp(/^(d{1})[^d]|[^d](d{1})[^d]/g);
        mmntns.dd = new RegExp(/^(d{2})[^d]|[^d](d{2})[^d]/g);
        mmntns.fy = new RegExp(/(y{4})|y{2}/g);
        const regexkeys = Object.keys(mdre);
        function matchmap(regexval: { exec: (arg0: any) => any; }, stringval: any) {
            let da:any = [];
            const matches:any = [];
            // tslint:disable-next-line:no-conditional-assignment
            while ((da = regexval.exec(stringval)) !== null) {
                const keypair:any = {};
                keypair.index = da.index;
                keypair.matchexp = da[0];
                if (da.length > 1) {
                    for (let n = 1; n < da.length; n++) {
                        const mstr = 'matchval' + n.toString();
                        keypair[mstr] = da[n];
                    }
                }
                matches.push(keypair);
            }
            return matches;
        }
        function ucreplacer(match: string) {
            return match.toUpperCase();
        }
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < regexkeys.length; j++) {
            let k: number;
            switch (regexkeys[j]) {
                case 'date':
                    const strvald = str;
                    const datematcharray = matchmap(mdre.date, strvald);
                    if (datematcharray.length) {
                        for (k = 0; k < datematcharray.length; k++) {
                            // var fdate = moment(datematcharray[k].matchval).format('DD,dd,MM,YYY');
                            let fdate = new Date(datematcharray[k].matchval1).toLocaleDateString();
                            fdate = ' ' + fdate.toString() + ' ';
                            str = str.replace(datematcharray[k].matchexp.toString(), fdate);
                        }
                    }
                    break;
                case 'time':
                    const strvalt = str;
                    const timematcharray = matchmap(mdre.time, strvalt);
                    if (timematcharray.length) {
                        for (k = 0; k < timematcharray.length; k++) {
                            let ftime = new Date(timematcharray[k].matchval1).toLocaleTimeString();
                            ftime = ' ' + ftime.toString() + ' ';
                            str = str.replace(timematcharray[k].matchexp.toString(), ftime);
                        }
                    }
                    break;
                case 'datetime':
                    const strvaldt = str;
                    const dtimematcharray = matchmap(mdre.datetime, strvaldt);
                    if (dtimematcharray.length) {
                        for (k = 0; k < dtimematcharray.length; k++) {
                            let ms = '';
                            const mergekeylength = Object.keys(dtimematcharray[k]).length - 2;
                            for (let l = 2; l < mergekeylength; l++) {
                                const keystr = 'matchval' + l.toString();
                                ms += dtimematcharray[k][keystr];
                            }
                            const foptionstring = 'matchval' + mergekeylength.toString();
                            let fmtstr = dtimematcharray[k][foptionstring];
                            fmtstr = fmtstr.replace(mmntns.fy, ucreplacer);
                            fmtstr = fmtstr.replace(mmntns.dd, ucreplacer);
                            fmtstr = fmtstr.replace(mmntns.sd, ucreplacer);
                            // var fdtime = new Date(dtimematcharray[k].matchval).toLocaleString();
                            let fdtime = moment(ms).format(fmtstr);
                            fdtime = ' ' + fdtime.toString() + ' ';
                            str = str.replace(dtimematcharray[k].matchexp.toString(), fdtime);
                        }
                    }
                    break;
                case 'num':
                    const strnumval = str;
                    const nummatcharray = matchmap(mdre.num, strnumval);
                    if (nummatcharray.length) {
                        for (k = 0; k < nummatcharray.length; k++) {
                            let fnum = Number(nummatcharray[k].matchval1).toLocaleString();
                            fnum = ' ' + fnum.toString() + ' ';
                            str = str.replace(nummatcharray[k].matchexp.toString(), fnum);
                        }
                    }
                    break;
                case 'curr':
                    const strcurval = str;
                    const currmatcharray = matchmap(mdre.curr, strcurval);
                     let browserLang = 'en';
                    if(window.navigator){
                     browserLang = window.navigator.language;
                    }
                    const curcode = new RegExp(/\w{3}/);
                    if (currmatcharray.length) {
                        for (k = 0; k < currmatcharray.length; k++) {
                            // tslint:disable-next-line:one-variable-per-declaration
                            const currops:any = {};
                            let fcode: { toString: () => any; }[];
                            currops.style = 'currency';
                            if (currmatcharray[k].matchval2) {
                                fcode = curcode.exec(currmatcharray[k].matchval2);
                            }
                            currops.currency = fcode[0].toString();
                            let fcurr = Number(currmatcharray[k].matchval1).toLocaleString(browserLang, currops);
                            // check for browser support if browser doesnot suppor we get the same value back and we append the currency Code
                            if (currmatcharray[k].matchval1.toString() === fcurr.toString()) {
                                fcurr = ' ' + fcurr.toString() + ' ' + currops.currency;
                            } else {
                                fcurr = ' ' + fcurr.toString() + ' ';
                            }
                            str = str.replace(currmatcharray[k].matchexp.toString(), fcurr);
                        }
                    }
                    break;
            }
        }
        function nextLnReplacer(match: any, p1: any, offset: any) {
            return '<br/>';
        }
        function ignoreWords(stri: string){
            const _words=['onclick','onmouse','onblur','onscroll','onStart'];
            _words.forEach((word)=>{
                const regEx1 = new RegExp(word, 'ig');
                stri = stri.replace(regEx1, '');
            });
            return stri;
        }
        const nextln = regEx.NEWLINE;
        // tslint:disable-next-line:variable-name
        function linkreplacer(match: string, p1: string | string[], offset: any, string: string) {
            let dummyString = string.replace(_regExForMarkdownLink, '[]');
            dummyString=ignoreWords(dummyString);
            if (dummyString.indexOf(match) !== -1) {
                // tslint:disable-next-line:one-variable-per-declaration
                let _link = p1.indexOf('http') < 0 ? 'http://' + match : match, _target: string;
                // _link = encodeURIComponent(_link);
                _target = 'target=\'underscoreblank\'';
                if (hyperLinksMap) {
                    const _randomKey = 'korerandom://' + Object.keys(hyperLinksMap).length;
                    hyperLinksMap[_randomKey] = _link;
                    _link = _randomKey;
                }
                return '<span class=\'isLink\'><a ' + _target + ' href="' + _link + '">' + match + '</a></span>';
            } else {
                return match;
            }
        }
        // check for whether to linkify or not
        try {
            str = decodeURIComponent(str);
        } catch (e) {
            str = str || '';
        }
        // tslint:disable-next-line:one-variable-per-declaration
        let newStr = '', wrapper1: HTMLDivElement;
        if (responseType === 'user') {
            str = str.replace(/onerror=/gi, 'abc-error=');
            wrapper1 = document.createElement('div');
            newStr = str.replace(/“/g, '\"').replace(/”/g, '\"');
            newStr = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            wrapper1.innerHTML = this.xssAttack(newStr);
            if ($(wrapper1).find('a').attr('href')) {
                str = newStr;
            } else {
                str = newStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(_regExForLink, linkreplacer);
            }
        } else {
            wrapper1 = document.createElement('div');
            // str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            wrapper1.innerHTML = this.xssAttack(str);
            if ($(wrapper1).find('a').attr('href')) {
                const linkArray = str.match(/<a[^>]*>([^<]+)<\/a>/g);
                // tslint:disable-next-line:prefer-for-of
                for (let x = 0; x < linkArray.length; x++) {
                    const _newLA = document.createElement('div');
                    let _detectedLink=linkArray[x];

                    // for mailto: links, new line character need to be repaced with %0A
                    if(_detectedLink.indexOf('href=\'mailto:')>-1||_detectedLink.indexOf('href="mailto:')>-1){
                        _detectedLink=_detectedLink.split('\n').join('%0A')

                    }
                    const _randomKey='korerandom://'+Object.keys(hyperLinksMap).length;
                    _newLA.innerHTML = _detectedLink;

                    const _aEle=_newLA.getElementsByTagName('a');
                    if(_aEle && _aEle[0] && _aEle[0].href){
                        hyperLinksMap[_randomKey]=_aEle[0].href;
                        _aEle[0].href=_randomKey;
                    }
                    $(_newLA).find('a').attr('target', 'underscoreblank');
                    str = str.replace(linkArray[x], _newLA.innerHTML);
                }
            } else {
                str = wrapper1.innerHTML.replace(_regExForLink, linkreplacer);
            }
        }
        str = this.checkMarkdowns(str,hyperLinksMap);
        const hrefRefs=Object.keys(hyperLinksMap);
        if(hrefRefs && hrefRefs.length){
            hrefRefs.forEach((hrefRef) =>{
                function customStrReplacer() { // custom replacer is used as by default replace() replaces with '$' in place of '$$'
                    return hyperLinksMap[hrefRef];
                }
                str = str.replace(hrefRef, customStrReplacer);
            });
        }
        str=this.replaceAll('target="underscoreblank"','target="_blank"',str);
        str=this.replaceAll('target=\'underscoreblank\'','target="_blank"',str);
        if (responseType === 'user') {
            str = str.replace(/abc-error=/gi, 'onerror=');
        }
        return this.nl2br(str, true);
    },
    checkMarkdowns (val: any,hyperLinksMap: { [x: string]: any; }) {
        const txtArr = val.split(/\r?\n/);
        for (let i = 0; i < txtArr.length; i++) {
            let _lineBreakAdded = false;
            if (txtArr[i].indexOf('#h6') === 0 || txtArr[i].indexOf('#H6') === 0) {
                txtArr[i] = '<h6>' + txtArr[i].substring(3) + '</h6>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('#h5') === 0 || txtArr[i].indexOf('#H5') === 0) {
                txtArr[i] = '<h5>' + txtArr[i].substring(3) + '</h5>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('#h4') === 0 || txtArr[i].indexOf('#H4') === 0) {
                txtArr[i] = '<h4>' + txtArr[i].substring(3) + '</h4>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('#h3') === 0 || txtArr[i].indexOf('#H3') === 0) {
                txtArr[i] = '<h3>' + txtArr[i].substring(3) + '</h3>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('#h2') === 0 || txtArr[i].indexOf('#H2') === 0) {
                txtArr[i] = '<h2>' + txtArr[i].substring(3) + '</h2>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('#h1') === 0 || txtArr[i].indexOf('#H1') === 0) {
                txtArr[i] = '<h1>' + txtArr[i].substring(3) + '</h1>';
                _lineBreakAdded = true;
            } else if (txtArr[i].length === 0) {
                txtArr[i] = '\r\n';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('*') === 0) {
                if (!this.isEven(txtArr[i].split('*').length - 1)) {
                    txtArr[i] = '\r\n&#9679; ' + txtArr[i].substring(1);
                    _lineBreakAdded = true;
                }
            } else if (txtArr[i].indexOf('>>') === 0) {
                txtArr[i] = '<p class="indent">' + txtArr[i].substring(2) + '</p>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('&gt;&gt;') === 0) {
                txtArr[i] = '<p class="indent">' + txtArr[i].substring(8) + '</p>';
                _lineBreakAdded = true;
            } else if (txtArr[i].indexOf('---') === 0 || txtArr[i].indexOf('___') === 0) {
                txtArr[i] = '<hr/>' + txtArr[i].substring(3);
                _lineBreakAdded = true;
            }
            let j: number;
            // Matches Image markup ![test](http://google.com/image.png)
            if(txtArr[i].indexOf(' ![') === -1) {// replace method trimming last'$' character, to handle this adding ' ![' extra space
                txtArr[i] = txtArr[i].replace('![',' ![');
            }
            const _matchImage = txtArr[i].match(/\!\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
            if (_matchImage && _matchImage.length > 0) {
                for (j = 0; j < _matchImage.length; j++) {
                    const _imgTxt = _matchImage[j].substring(2, _matchImage[j].indexOf(']'));
                    const remainingString = _matchImage[j].substring(_matchImage[j].indexOf(']') + 1).trim();
                    let _imgLink = remainingString.substring(1, remainingString.indexOf(')'));
                    if (hyperLinksMap) {
                        const _randomKey = 'korerandom://' + Object.keys(hyperLinksMap).length;
                        hyperLinksMap[_randomKey] = _imgLink;
                        _imgLink = _randomKey;
                    }
                    _imgLink = '<img src="' + _imgLink + '" alt="' + _imgTxt + '">';
                    const _tempImg = txtArr[i].split(' ');
                    for (let k = 0; k < _tempImg.length; k++) {
                        if (_tempImg[k] === _matchImage[j]) {
                            _tempImg[k] = _imgLink;
                        }
                    }
                    txtArr[i] = _tempImg.join(' ');
                    txtArr[i] = txtArr[i].replace(_matchImage[j], _imgLink);
                }
            }
            // Matches link markup [test](http://google.com/)
            /// var _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
            const _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)?/g);
            if (_matchLink && _matchLink.length > 0) {
                for (j = 0; j < _matchLink.length; j++) {
                    const _linkTxt = _matchLink[j].substring(1, _matchLink[j].indexOf(']'));
                    const remainingString = _matchLink[j].substring(_matchLink[j].indexOf(']') + 1).trim();
                    let _linkLink = remainingString.substring(1, remainingString.indexOf(')'));
                    _linkLink=_linkLink.replace(/\\n/g,'%0A');
                    if (hyperLinksMap) {
                        const _randomKey = 'korerandom://' + Object.keys(hyperLinksMap).length;
                        hyperLinksMap[_randomKey] = _linkLink;
                        _linkLink = _randomKey;
                    }
                    _linkLink = '<span class="isLink"><a href="' + _linkLink + '" target="underscoreblank">' + this.checkMarkdowns(_linkTxt ,null) + '</a></span>';
                    txtArr[i] = txtArr[i].replace(_matchLink[j], _linkLink);
                }
            }
            // Matches bold markup *test* doesnot match * test *, * test*. If all these are required then replace \S with \s
            const _matchAstrik = txtArr[i].match(/\*\S([^*]*?)\*/g);
            if (_matchAstrik && _matchAstrik.length > 0) {
                for (j = 0; j < _matchAstrik.length; j++) {
                    let _boldTxt = _matchAstrik[j];
                    _boldTxt = _boldTxt.substring(1, _boldTxt.length - 1);
                    _boldTxt = '<b>' + _boldTxt.trim() + '</b>';
                    txtArr[i] = txtArr[i].replace(_matchAstrik[j], _boldTxt);
                }
            }
            // For backward compatability who used ~ for Italics
            // Matches italic markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
            const _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
            if (_matchItalic && _matchItalic.length > 0) {
                for (j = 0; j < _matchItalic.length; j++) {
                    let _italicTxt = _matchItalic[j];
                    if (txtArr[i].indexOf(_italicTxt) === 0 || txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === ' ' || txtArr[i].indexOf(_italicTxt) !== -1) {
                        _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
                        _italicTxt = '<i class="markdownItalic">' + _italicTxt + '</i>';
                        txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
                    }
                }
            }
            // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
            const _matchPre = txtArr[i].match(/\`\`\`\S([^*]*?)\S\`\`\`/g);
            const _matchPre1 = txtArr[i].match(/\'\'\'\S([^*]*?)\S\'\'\'/g);
            if (_matchPre && _matchPre.length > 0) {
                for (j = 0; j < _matchPre.length; j++) {
                    let _preTxt = _matchPre[j];
                    _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                    _preTxt = '<pre>' + _preTxt + '</pre>';
                    txtArr[i] = txtArr[i].replace(_matchPre[j], _preTxt);
                }
                _lineBreakAdded = true;
            }
            if (_matchPre1 && _matchPre1.length > 0) {
                for (j = 0; j < _matchPre1.length; j++) {
                    let _preTxt = _matchPre1[j];
                    _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                    _preTxt = '<pre>' + _preTxt + '</pre>';
                    txtArr[i] = txtArr[i].replace(_matchPre1[j], _preTxt);
                }
                _lineBreakAdded = true;
            }
            if (!_lineBreakAdded && i > 0) {
                txtArr[i] = '\r\n' + txtArr[i];
            }
        }
        val = txtArr.join('');
        return val;
    }
};
}

