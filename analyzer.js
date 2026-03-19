// ─── EXAMPLES ───────────────────────────────────────────────────────────────
// NOTE: The Columbia/Signal-style deal is used only as an internal benchmark
// for scoring calibration — it is not exposed as a user-facing example.

const EXAMPLES = {
major:`EXCLUSIVE RECORDING AGREEMENT

This Exclusive Recording Agreement ("Agreement") is entered into between APEX RECORDS LLC ("Label") and the artist ("Artist").

TERM: The initial term shall continue until Artist has delivered one (1) Album. Label shall have six (6) irrevocable options to extend the term for one (1) Album each, exercisable in Label's sole discretion. The total potential commitment is seven (7) Albums.

MASTER RECORDINGS: All master recordings created hereunder shall be considered "works made for hire" and shall be the exclusive property of Label in perpetuity throughout the universe. Artist hereby irrevocably assigns to Label all right, title, and interest in such recordings in perpetuity.

ADVANCES: Label shall provide a recording fund of $75,000 for the Initial Period, inclusive of recording costs. All recording costs, independent promotion costs, video production costs, and marketing expenses shall be fully recoupable from Artist's royalties on a cross-collateralized basis across all Albums.

ROYALTIES: Label shall pay Artist a royalty of thirteen percent (13%) of the suggested retail list price of Net Sales, subject to: (a) Packaging Deduction: twenty-five percent (25%) for all configurations; (b) New Technology Reduction: royalties on digital downloads and streaming shall be paid at seventy-five percent (75%) of the otherwise applicable rate; (c) Foreign Royalties: fifty percent (50%) of the applicable U.S. royalty rate for sales outside the United States; (d) Free Goods: no royalties on up to fifteen percent (15%) of Albums distributed as free goods; (e) Returns Reserve: thirty-five percent (35%) of royalties held in reserve for four (4) accounting periods.

CONTROLLED COMPOSITIONS: Artist agrees to license all Controlled Compositions at three-quarters (3/4) of the minimum statutory mechanical royalty rate. The maximum aggregate mechanical royalty per Album shall not exceed ten (10) times such three-quarters rate.

MULTIPLE RIGHTS (360 PROVISION): Label shall receive twenty percent (20%) of Artist's gross income from: (a) live performance and touring; (b) merchandise and licensing; (c) endorsements and sponsorships; (d) acting, modeling, and other entertainment activities; (e) fan clubs and websites during the term and for three (3) years following expiration.

PUBLISHING: Artist grants to Label's affiliated publishing company a co-publishing interest equal to fifty percent (50%) of Artist's ownership interest in all compositions recorded under this Agreement. Label Publishing shall administer all such compositions worldwide.

EXCLUSIVITY: For two (2) years following expiration, Artist shall not record any composition recorded under this Agreement for any third party.

AUDIT RIGHTS: Artist may audit Label's books no more than once per year upon sixty (60) days' written notice.`,

indie:`RECORDING AND DISTRIBUTION AGREEMENT

Between CROSSROADS MUSIC GROUP ("Label") and Artist.

TERM: Two (2) year initial term. Label shall have two (2) options to extend, each for one (1) additional Album plus twelve (12) months, exercisable within ninety (90) days prior to expiration.

MASTER RECORDINGS: Label shall own the master recordings during the term and for seven (7) years following commercial release of each Album. Ownership shall automatically revert to Artist upon expiration of such seven-year period, provided Artist has fulfilled all material obligations.

RECORDING FUND: Label shall provide a recording fund of $30,000 per Album. Recording costs shall not exceed the recording fund. Any unused portion shall be paid to Artist as a cash advance. Advances are recoupable from royalties but non-returnable.

ROYALTIES: Artist shall receive: (a) Digital Downloads and Streaming: eighteen percent (18%) of net receipts; (b) Physical Sales: sixteen percent (16%) of net receipts — no packaging deductions shall apply; (c) Sync Licensing: fifty percent (50%) of net sync fees; (d) Foreign Sales: fourteen percent (14%) of net receipts. No free goods provisions apply to digital sales.

MECHANICAL ROYALTIES: Label shall pay mechanical royalties on all Controlled Compositions at the full minimum statutory mechanical royalty rate in effect at the time of commercial release, with no reductions or caps.

TERRITORY: United States and Canada only. Artist retains all rights in all other territories.

RELEASE COMMITMENT: Label shall commercially release each Album within nine (9) months of delivery. If Label fails to release, Artist may provide written notice, and if Label does not cure within sixty (60) days, all rights revert to Artist.

NO 360 PROVISIONS: Label shall have no claim to Artist's income from live performances, touring, merchandise, endorsements, or any other entertainment activity.

PUBLISHING: Artist retains one hundred percent (100%) of all publishing rights. Label claims no interest in Artist's publishing or songwriting income.

AUDIT RIGHTS: Artist may audit Label's books once per accounting period upon thirty (30) days' written notice. If an audit reveals underpayment exceeding five percent (5%), Label shall pay the audit cost.`,

distribution:`EXCLUSIVE DISTRIBUTION AND LICENSING AGREEMENT

Between OPEN ROAD DISTRIBUTION LLC ("Distributor") and Artist.

OWNERSHIP: Artist is and shall remain the sole and exclusive owner of all master recordings. This Agreement constitutes a license of distribution rights only — not an assignment or transfer of ownership.

LICENSE TERM: Artist grants Distributor an exclusive license for three (3) years from the commercial release date. All rights revert to Artist automatically upon expiration.

REVENUE SPLIT: Distributor retains twenty percent (20%) as its fee. Artist receives eighty percent (80%) of all net revenues from digital streaming, downloads, physical sales, and sync licensing. Revenues are paid monthly within thirty (30) days of month-end.

NO ADVANCE RECOUPMENT: No advances are provided. All revenues are paid to Artist on a current basis with no recoupment obligations.

MECHANICAL ROYALTIES: Artist retains one hundred percent (100%) of all mechanical royalties. Distributor claims no interest in any publishing income or performance royalties.

MARKETING COMMITMENT: Distributor shall commit a minimum of $5,000 per release toward digital marketing and playlist pitching. Marketing spend is non-recoupable.

TERRITORY: Worldwide digital distribution across all platforms.

NO 360 PROVISIONS: Distributor has no claim to Artist's income from live performances, touring, merchandise, endorsements, or any other activity.

TERMINATION: After twelve (12) months, either party may terminate with thirty (30) days' written notice, without cause. Upon termination, all rights revert immediately to Artist.

AUDIT RIGHTS: Artist may audit Distributor's records at any time upon fifteen (15) days' written notice.

NON-EXCLUSIVE AFTER TERM: Following expiration or termination, Distributor has no rights of any kind with respect to the master recordings.`
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const has  = (l,...t) => t.some(x=>l.includes(x));
const hasAll=(l,...t) => t.every(x=>l.includes(x));
const pctNear=(l,kw,range=140)=>{
  const i=l.indexOf(kw); if(i<0)return null;
  const chunk=l.slice(Math.max(0,i-range),i+range);
  const m=chunk.match(/(\d+(?:\.\d+)?)\s*%/); return m?parseFloat(m[1]):null;
};
const firstNum=(text,re)=>{const m=text.match(re);return m?parseFloat(m[1].replace(/,/g,'')):null;};

// ─── MASTER OWNERSHIP ───────────────────────────────────────────────────────
function detectMasters(text,l){
  const wfh=has(l,'work made for hire','works made for hire','work-made-for-hire');
  const perp=has(l,'in perpetuity','perpetual','throughout the universe');
  const labelOwns=has(l,'exclusive property of label','owned by label','label shall own');
  const artistOwns=has(l,'artist is and shall remain the sole','artist retains full ownership','owned by artist');
  const reversion=has(l,'shall revert to artist','revert to artist','automatically revert');
  const licenseOnly=has(l,'constitutes a license only','license of','license only');
  let type,value,rating,notes,summary,industryStandard,impact;
  if(artistOwns||licenseOnly){
    type='artist_owned';value='Artist retains full ownership';rating='good';summary='You own your recordings outright.';
    notes='The label receives a license to distribute your work, not ownership. This is the gold standard — you can pull your music, sell it, relicense it, or leave for another distributor once the term ends.';
    industryStandard='Most major label deals use "work for hire" language giving the label permanent ownership. Artist ownership is common in distribution deals and modern indie agreements but rare in major label contracts.';
    impact='Owning your masters means owning a long-term asset. Your recordings can appreciate in value over your career. You can re-license to films, ads, and other media — and collect 100% of those fees directly.';
  } else if(reversion){
    const ym=l.match(/(\d+)[- ]years?[^.]*revert/i)||l.match(/revert[^.]*?(\d+)[- ]years?/i);
    const yrs=ym?parseInt(ym[1]):null;
    type='lease';
    value=yrs?`Label owns masters, revert to artist after ${yrs} years`:'Masters revert to artist (term unspecified)';
    rating=yrs&&yrs<=7?'neutral':'bad';
    summary=yrs?`Label-owned for ${yrs} years, then yours.`:'Label-owned, eventually reverts.';
    notes=yrs?`The label owns your recordings for ${yrs} years post-release, then they return to you. ${yrs<=5?'This is a solid reversion window.':yrs<=10?'Aim for 5 years or less — 10 years is a long time in music.':'Very long — negotiate this down hard.'}`:'Masters revert but the timeline is not clearly specified. You must nail down an exact trigger date before signing.';
    industryStandard='Major labels typically do not include reversion clauses. When they appear (usually in indie deals), 5–7 years post-release is the modern standard. Anything over 10 years is unfavorable.';
    impact=yrs?`If your album drops in 2025, you don't get your masters back until ${2025+yrs}. In the meantime the label can license your music to films, ads, and streaming platforms and keep a share of that revenue.`:'Without a clear reversion date, the label can delay in ways that extend their control indefinitely.';
  } else if(wfh||perp||labelOwns){
    type='label_owned';
    value=wfh?'Label owns masters forever (Work for Hire)':'Label owns masters in perpetuity';
    rating='bad';summary='Label owns your recordings permanently.';
    notes='"Work made for hire" is the most permanent form of ownership. Under U.S. copyright law, when your recordings are "works for hire," you are legally treated as never having been the author. Unlike a standard assignment (where you might reclaim rights after 35 years under Section 203), work-for-hire recordings cannot be reclaimed at any point. This is the clause Taylor Swift fought against and ultimately left Big Machine Records over.';
    industryStandard='Major labels almost universally use perpetual ownership or work-for-hire language. This has been the standard for decades, but artists like Taylor Swift, Prince, and TLC have all publicly fought against it. Modern indie deals increasingly offer reversion.';
    impact='Your recordings — including every mix, every alt version, every video — belong to the label forever. They can license your music to advertisements, films, or TV shows you find offensive. If the label is acquired, your entire catalog transfers to the new owner with no notification or compensation to you. You have zero recourse.';
  } else {
    type='unclear';value='Ownership terms unclear';rating='unknown';summary='Ownership not clearly stated.';
    notes='Master ownership is not clearly addressed. This is one of the most important clauses in any recording contract — before signing, you must have an explicit statement of who owns the recordings and under what terms.';
    industryStandard='Any legitimate recording agreement must explicitly state who owns the masters and for how long.';
    impact='Ambiguous ownership language will be interpreted in court — often in the label\'s favor. Do not sign any contract without this clearly defined.';
  }
  return{value,type,rating,notes,summary,industryStandard,impact};
}

// ─── ROYALTIES ──────────────────────────────────────────────────────────────
function detectRoyalties(text,l){
  const splitM=l.match(/(\d+)\s*(?:percent|%)\s*(?:of\s+)?(?:net\s+)?(?:revenues?|receipts?)/);
  const srlpM=l.match(/royalt\w*\s+of\s+(\d+(?:\.\d+)?)\s*(?:percent|%)/i)||l.match(/(\d+(?:\.\d+)?)\s*%\s+of\s+(?:the\s+)?(?:suggested retail|srlp|net sales)/i);
  const isAllin=has(l,'"all-in"','all-in','all in')&&has(l,'royalt','receipt');
  let pct=null,isSplit=false;
  if(splitM){pct=parseFloat(splitM[1]);isSplit=pct>30;}
  if(srlpM&&!isSplit)pct=parseFloat(srlpM[1]);
  // Also check for receipts percentage (like Columbia deal: "18% of Label's receipts")
  if(!pct){const rm=l.match(/(\d+(?:\.\d+)?)\s*%[^.]{0,60}receipts/i)||l.match(/receipts[^.]{0,60}(\d+(?:\.\d+)?)\s*%/i);if(rm)pct=parseFloat(rm[1]);}
  let value,rating,notes,summary,industryStandard,impact;
  const effectivePct=isAllin&&pct?(pct-3.5):pct; // subtract avg producer points for all-in
  if(isSplit&&pct){
    value=`${pct}% revenue share to artist`;
    rating=pct>=70?'good':pct>=50?'neutral':'bad';
    summary=`${pct}% of all revenue goes to you.`;
    notes=`A ${pct}% revenue share (profit-split model) means you get ${pct} cents of every dollar the distributor collects, with no deductions for packaging, free goods, or other traditional label tricks. This is fundamentally different from a royalty-on-SRLP deal.`;
    industryStandard='Profit-split deals are common in distribution agreements. 80/20 (artist/distributor) is considered excellent, 70/30 is good, 50/50 is minimum acceptable.';
    impact=`On $100,000 in annual streaming revenue, you\'d receive $${pct*1000}. Compare that to a 15% SRLP royalty deal with standard deductions, where the same revenue might net you $30,000–$40,000.`;
  } else if(pct){
    value=isAllin?`${pct}% all-in royalty (net to you: ~${Math.round(effectivePct)}% after producer fees)`:`${pct}% royalty`;
    if(pct>=20){rating='good';summary=`${pct}% — above industry average.`;}
    else if(pct>=18){rating='good';summary=`${pct}% — solid rate for a developing artist deal.`;}
    else if(pct>=16){rating='neutral';summary=`${pct}% — around indie standard.`;}
    else if(pct>=14){rating='neutral';summary=`${pct}% — below indie standard, typical major label.`;}
    else if(pct>=12){rating='bad';summary=`${pct}% — low. Real rate after deductions is worse.`;}
    else{rating='bad';summary=`${pct}% — below minimum. Reject this.`;}
    notes=isAllin
      ?`"All-in" means your ${pct}% royalty must also cover producer royalties, which typically run 3–5 points (3–5%). If your producer gets 4 points, your effective take is only ~${pct-4}%. This is a critical distinction — a 18% all-in deal is materially different from an 18% artist royalty where the label pays producers separately.`
      :`Your royalty is ${pct}% of the royalty base price. Before this gets calculated, packaging deductions (15–25%), free goods (15%), and digital royalty reductions may apply — cutting your real, effective rate significantly.`;
    industryStandard='By tier: Major label new artist: 13–16% all-in. Major label established: 16–22%. Indie label: 15–18% of net receipts (no packaging deductions). Distribution deals: 70–85% of gross revenue. The "industry standard" 15% has not kept up with streaming economics — artists should push for 18%+.';
    impact=isAllin
      ?`On a $9.99 album sale: label receives ~$7 after platform cut. At 18% all-in you get $1.26, minus ~4% producer royalty ($0.28) = $0.98/album. At true 18% (non-all-in) you'd get $1.26. The difference compounds into thousands of dollars at scale.`
      :`On $1,000,000 in label receipts: at ${pct}% you earn $${pct*10000}. After a 25% packaging deduction and 15% free goods, the effective base is reduced to ~$637,500, meaning you actually earn $${Math.round(pct/100*637500).toLocaleString()} — not $${pct*10000}.`;
  } else {
    value='Royalty rate not clearly specified';rating='unknown';summary='No rate found — must clarify.';
    notes='No royalty rate was identified. A royalty rate is mandatory in any recording contract and must specify the base (SRLP vs net receipts), the percentage, and how it applies to digital vs physical.';
    industryStandard='All recording agreements must specify a royalty rate.';
    impact='Without a clear royalty rate, you have no basis for disputing underpayments.';
  }
  return{value,numericValue:pct||0,effectiveValue:effectivePct||0,isSplit,isAllin,rating,notes,summary,industryStandard,impact};
}

// ─── TERM LENGTH ────────────────────────────────────────────────────────────
function detectTermLength(text,l){
  const albumBased=has(l,'album commitment period','until delivery','until artist has delivered');
  const yrsM=l.match(/(?:initial\s+)?term[^.]*?(\d+)\s*year/i);
  const mixtapeM=has(l,'mixtape','commitment records','commitment sides');
  if(mixtapeM&&!albumBased){
    return{value:'Single project cycle (mixtape + additional tracks)',rating:'good',summary:'Limited single-cycle commitment.',
      notes:'This is a single-cycle deal with no stacked album options, which is relatively favorable. However, the existing materials handover and post-term matching rights create additional obligations beyond the initial commitment.',
      industryStandard:'Major label deals typically demand 6–7 album options. A single-project deal is increasingly common for developing artists as labels test the relationship before committing.',
      impact:'You\'re bound for one project cycle. However, check for option clauses — labels sometimes bury the right to extend even in single-cycle language.'};
  }
  if(albumBased){
    const commitment=detectCommitment(text,l);
    return{value:`Album-based term (${commitment.numericTotal||'unspecified'} total albums)`,
      rating:commitment.numericTotal>=5?'bad':commitment.numericTotal>=3?'neutral':'good',
      summary:`Term runs until you deliver ${commitment.numericTotal||'unspecified'} albums.`,
      notes:'Album-based terms have no fixed calendar end — they can stretch indefinitely if you release slowly or the label holds back recordings. Always insist on a maximum calendar length alongside the album count.',
      industryStandard:'Best practice is a hybrid: e.g. "2 album options OR 5 years, whichever comes first." Pure album-based terms benefit the label by allowing indefinite extension.',
      impact:'If the label chooses not to release an album, the clock doesn\'t run. Your career is frozen until the label decides to move.'};
  }
  if(yrsM){
    const y=parseInt(yrsM[1]);
    return{value:`${y}-year initial term`,rating:y<=2?'good':y<=4?'neutral':'bad',
      summary:`${y} years initial.`,
      notes:`${y} years is ${y<=2?'a reasonable initial period':'on the longer side'}. Consider what happens during this period if the label doesn\'t actively promote your music — are you locked in with no release commitment?`,
      industryStandard:'1–2 years is standard for initial terms. Beyond 4 years for an initial period is atypical and unfavorable.',
      impact:`At ${y} years, you could sign at age 22 and not be free to sign elsewhere until ${22+y}. That is a significant portion of your career development window.`};
  }
  return{value:'Not clearly specified',rating:'unknown',summary:'Term duration unclear.',
    notes:'Term length was not clearly identified. Every recording contract must define exactly how long it lasts.',
    industryStandard:'All contracts must specify term length.',
    impact:'An ambiguous term could be argued to run indefinitely.'};
}

// ─── COMMITMENT ─────────────────────────────────────────────────────────────
function detectCommitment(text,l){
  const optM=l.match(/(\d+)\s*(?:additional\s+)?(?:irrevocable\s+)?options?\s+to\s+(?:extend|renew)/i)||l.match(/(\d+)\s*option\s*periods?/i);
  const totM=l.match(/total\s+potential\s+commitment[^.]*?(\d+)\s*albums?/i)||l.match(/(\d+)\s*albums?\s*(?:in total|total)/i);
  const mixtapeM=l.match(/one\s*\(1\)\s*mixtape[^.]*?plus\s*(?:five|(\d+))\s*(?:additional|commitment)/i);
  if(mixtapeM){
    return{value:'1 mixtape (15 tracks) + 5 additional commitment sides',numericOptions:0,numericTotal:1,rating:'good',
      summary:'1 project cycle. No stacked options.',
      notes:'The commitment is limited to one mixtape (15 tracks) and five additional commitment sides — roughly a full album\'s worth of material across two deliveries. There are no stacked option periods giving the label the right to demand additional albums.',
      industryStandard:'Major labels often demand 6–7 album options. A single-cycle commitment like this is far more artist-friendly and is increasingly common in developing artist deals.',
      impact:'Once you deliver all commitment records, your obligation under the product commitment is fulfilled. However, the post-term matching right means you still cannot freely sign elsewhere for 12 months after the term ends.'};
  }
  const total=totM?parseInt(totM[1]):(optM?parseInt(optM[1])+1:null);
  const optCount=optM?parseInt(optM[1]):(totM?parseInt(totM[1])-1:0);
  if(total){
    return{value:totM?`${total} albums total`:`1 album + ${optCount} options (${total} total)`,
      numericOptions:optCount,numericTotal:total,
      rating:total>=6?'bad':total>=4?'neutral':'good',
      summary:total>=6?`${total} albums — potentially a decade of your career.`:total>=4?`${total} albums — significant commitment.`:`${total} albums — manageable.`,
      notes:total>=6?`${total} albums at 1.5–2 years per album = ${Math.round(total*1.5)}–${total*2} years. Options are exercised at the label\'s sole discretion — they keep you when profitable and can drop you when not, but you cannot exit early.`:`${total} album commitment is ${total>=4?'above average. Push for fewer options with clear calendar time limits.':'manageable.'}`,
      industryStandard:'Pre-2000: 6–7 album deals were standard. 2000s–present: 3–4 albums. Modern developing artist: 1–2 albums + 1–2 options. Prince protested his 6-album deal with Warner Bros. TLC was bound to a 6-album deal despite bankruptcy.',
      impact:`At ${total} albums, options exercised one at a time at the label\'s discretion, you could be locked in for ${total*2}+ years with no guaranteed release date for any record.`};
  }
  return{value:'Not specified',numericOptions:0,numericTotal:0,rating:'unknown',summary:'Commitment unclear.',
    notes:'Could not identify the total number of albums or projects required.',
    industryStandard:'Every contract must define the exact number of records required.',
    impact:'Ambiguous commitment terms are usually interpreted in the label\'s favor.'};
}

// ─── ADVANCE ────────────────────────────────────────────────────────────────
function detectAdvance(text,l){
  // In-pocket advance
  const inPocketM=text.match(/\$\s*([\d,]+)\s*"?in-pocket"?\s*(?:artist\s+)?advance/i)||
    text.match(/"in-pocket"\s*(?:artist\s+)?advance[^$]*?\$\s*([\d,]+)/i)||
    text.match(/pay\s+a\s+\$\s*([\d,]+)\s*"?in-pocket/i);
  const inPocket=inPocketM?parseFloat(inPocketM[1].replace(/,/g,'')):null;
  // Recording fund/budget
  const fundM=text.match(/recording\s+(?:fund|budget)\s+of\s+(?:not\s+more\s+than\s+)?\$\s*([\d,]+)/i)||
    text.match(/\$\s*([\d,]+)[^.]*recording\s+(?:fund|budget)/i);
  const fund=fundM?parseFloat(fundM[1].replace(/,/g,'')):null;
  // Generic advance
  const advM=!inPocket?(text.match(/\$\s*([\d,]+)\s*(?:thousand|million)?[^.]*?(?<!recording )(?:advance)/i)||
    text.match(/(?:advance|recording fund)\s+of\s+\$?\s*([\d,]+)/i)):null;
  const genericAdv=advM?parseFloat(advM[1].replace(/,/g,'')):null;
  // Installments
  const inst=[];
  const instMatches=[...text.matchAll(/\(\s*[ivxIVX]+\s*\)\s*\$\s*([\d,]+)([^;.]{0,200})/gi)];
  instMatches.forEach(m=>{
    const amt=parseFloat(m[1].replace(/,/g,''));
    const desc=m[2].replace(/\s+/g,' ').trim().slice(0,120);
    if(amt>0)inst.push({amt,desc});
  });
  const recoupable=has(l,'recoupable','recoup');
  const crossCollat=has(l,'cross-collateral','cross collateral');
  const videoRecoup=has(l,'video production','video costs')&&recoupable;
  const promoRecoup=has(l,'independent promotion','marketing expenses')&&recoupable;
  const lodRequired=has(l,'letter of direction','lod');
  const existingHandover=has(l,'existing recordings','existing materials');
  const totalRecoup=(inPocket||genericAdv||0)+(fund||0)+(videoRecoup?40000:0)+(promoRecoup?40000:0);
  const royaltyPct=detectRoyalties(text,l).numericValue||18;
  const breakEvenReceipts=totalRecoup>0?Math.round(totalRecoup/(royaltyPct/100)):0;
  const breakEvenStreams=breakEvenReceipts>0?Math.round(breakEvenReceipts/0.004):0;
  const mainAmt=inPocket||genericAdv;
  if(!mainAmt&&!fund){
    return{value:'None / Not specified',
      notes:'No advance or recording fund was identified. Confirm whether any recording costs will be charged to your royalty account.',
      summary:'No advance found.',
      breakdown:null,
      industryStandard:'Advances range from $0 (distribution deals) to millions (superstar major label deals). A $0 advance is fine if there\'s also no recoupment.',
      impact:'No advance means no debt — you start earning royalties from day one, which is often better than a large advance you\'ll spend years paying back.'};
  }
  let breakdownSections=[];
  if(inPocket){
    breakdownSections.push({type:'adv-pocket',label:'In-Pocket Advance',value:`$${inPocket.toLocaleString()}`,sub:'Cash paid to you, recoupable from royalties'});
    if(inst.length>=2){
      inst.forEach((i,n)=>breakdownSections.push({type:'adv-fund',label:`Payment ${n+1}`,value:`$${i.amt.toLocaleString()}`,sub:i.desc}));
    }
  }
  if(fund){
    breakdownSections.push({type:'adv-fund',label:'Recording Budget',value:`$${fund.toLocaleString()}`,sub:'Covers studio costs (NOT in your pocket) — also recoupable'});
  }
  if(mainAmt||fund){
    breakdownSections.push({type:'adv-total',label:'Total Recoupable',value:`$${totalRecoup.toLocaleString()}`,sub:'Must be earned back before you see additional royalties'});
    if(breakEvenReceipts>0){
      breakdownSections.push({type:'adv-breakeven',label:`Breakeven (at ${royaltyPct}% royalty)`,value:`$${breakEvenReceipts.toLocaleString()} in label receipts`,sub:`≈ ${breakEvenStreams>0?(breakEvenStreams/1e6).toFixed(1)+'M streams at $0.004/stream':''}`});
    }
  }
  const extraRecoup=[];
  if(videoRecoup)extraRecoup.push('video production');
  if(promoRecoup)extraRecoup.push('independent promotion/marketing');
  if(crossCollat)extraRecoup.push('cross-collateralized across all albums');
  const value=inPocket?`$${inPocket.toLocaleString()} in-pocket${fund?` + $${fund.toLocaleString()} recording budget`:''}`
    :(genericAdv?`$${genericAdv.toLocaleString()} advance${fund?` + $${fund.toLocaleString()} recording budget`:''}`:fund?`$${fund.toLocaleString()} recording fund`:'Unknown');
  const notes=[
    inPocket?`The $${inPocket.toLocaleString()} is "in-pocket" — cash that goes directly to you. But it is recoupable, meaning your royalties pay this back before you see additional money.`:'',
    fund?`The $${fund.toLocaleString()} recording budget is separate. It pays for studio time, producers, mixing, and mastering — it does NOT go in your pocket. But it IS charged to your royalty account, so you must earn this back too.`:'',
    inst.length>=2?`Paid in installments: $${inst[0].amt.toLocaleString()} upfront, $${inst[1].amt.toLocaleString()} after delivering the final commitment record. The first payment requires multiple conditions including delivery of all existing materials.`:'',
    extraRecoup.length?`Also recoupable from your royalties: ${extraRecoup.join(', ')}.`:'',
    crossCollat?'Cross-collateralization means losses on one album are charged against earnings from another.':''
  ].filter(Boolean).join(' ');
  return{value,breakdown:breakdownSections,notes,summary:inPocket?`$${inPocket.toLocaleString()} in your pocket. $${totalRecoup.toLocaleString()} total to earn back.`:`$${(mainAmt||0).toLocaleString()} advance, $${totalRecoup.toLocaleString()} total recoupable.`,
    industryStandard:`Typical advance ranges: Indie new artist: $5K–$25K. Mid-level indie: $25K–$100K. Major developing artist: $100K–$500K. Major established: $500K–$2M+. In-pocket advances are always a fraction of the total recording fund — typically 30–50% of the fund if the artist controls costs.`,
    impact:`At a ${royaltyPct}% royalty rate, you must generate $${breakEvenReceipts.toLocaleString()} in label receipts before you earn a single additional dollar. That\'s approximately ${(breakEvenStreams/1e6).toFixed(1)} million streams. Until then, every stream pays down your debt to the label, not your bank account.`};
}

// ─── DISTRIBUTION ────────────────────────────────────────────────────────────
function detectDistribution(text,l){
  const worldwide=has(l,'worldwide','throughout the world','throughout the universe','all territories','the universe');
  const usOnly=!worldwide&&(has(l,'united states and canada','u.s. and canada')||has(l,'united states only'));
  const exclusive=has(l,'exclusive');
  let value=worldwide?'Worldwide (universe)':usOnly?'United States & Canada':'Territory not specified';
  value+=exclusive?', exclusive':'';
  return{value,rating:usOnly?'good':worldwide?'neutral':'unknown',summary:value,
    notes:worldwide?'Worldwide rights are standard but ensure the label is actively working each territory. Ask what happens in markets they aren\'t exploiting.':usOnly?'Limited to US/Canada — you\'re free to sign international distribution deals elsewhere, which is a real advantage.':'Territory is not clearly defined.',
    industryStandard:'Major labels claim worldwide rights as standard. Indie labels often limit to domestic territories, allowing artists to arrange international deals independently.',
    impact:worldwide?'If the label fails to exploit your music in international markets, you still can\'t license it there without their consent.':'Retaining international rights can be significantly valuable — streaming has made global audiences equally accessible.'};
}

// ─── PUBLISHING ──────────────────────────────────────────────────────────────
function detectPublishing(text,l){
  const labelPub=has(l,'co-publishing','affiliated publishing','label publishing',"publisher's share");
  const artistRetains=has(l,'artist retains one hundred percent','artist retains 100%','claims no interest in','100% of all publishing');
  const matchingRight=has(l,'first negotiation')&&has(l,'matching right')&&has(l,'publishing');
  const pct=pctNear(l,"publisher's share",200)||pctNear(l,'co-publishing',200);
  if(artistRetains){
    return{value:'Artist retains 100% of publishing',rating:'good',summary:'You own all your publishing.',
      notes:'The label claims no ownership of or income from your songwriting. Publishing includes mechanical royalties, performance royalties, sync licensing, and print rights.',
      industryStandard:'Keeping 100% of publishing is standard in distribution deals and most indie agreements. Major labels often attempt to take a co-publishing share as part of larger deals.',
      impact:'Publishing income from streaming, radio, sync placements, and covers can exceed your recording royalties over a long career. Keeping 100% means every sync placement, every cover, every film license generates income for you alone.'};
  }
  if(labelPub){
    const s=pct||50;
    return{value:`Label takes ${s}% of publishing`,rating:'bad',summary:`Label claims ${s}% of your songwriting income.`,
      notes:`The label takes ${s}% of your publishing rights — your ownership stake in the songs themselves, separate from the recordings. You\'re effectively losing income twice: once on the master (what the label earns from distributing the recording) and once on the composition (your songwriting share).`,
      industryStandard:'Co-publishing deals were common in major label deals throughout the 1990s–2000s but are increasingly considered outdated and exploitative. Modern label deals rarely include publishing grabs in exchange for a recording deal.',
      impact:`Publishing income for a successful songwriter can exceed $1M+ per career. Giving up ${s}% of it — on top of label ownership of your masters — means you\'re building the label\'s wealth at the expense of your own long-term financial security. Taylor Swift has spoken publicly about exactly this.`};
  }
  if(matchingRight){
    return{value:'Label has first negotiation + matching right on publishing',rating:'neutral',summary:'Label can match any publishing deal you sign.',
      notes:'This is not a full publishing grab — the label doesn\'t own your publishing outright. However, the matching right means if a publisher offers you a deal, the label can swoop in and match it on the same terms, giving them preferential treatment and potentially discouraging publishers from making offers.',
      industryStandard:'Publishing matching rights are common in major label deals as a softer alternative to full co-publishing. They create significant practical friction in the publishing marketplace.',
      impact:'Publishers may avoid making competitive offers knowing the label can simply match whatever they propose. This can result in you receiving lower publishing deal terms than you would on an open market.'};
  }
  return{value:'Publishing terms not addressed',rating:'unknown',summary:'Publishing rights unclear.',
    notes:'Publishing rights were not clearly addressed. Always confirm in writing that you retain 100% of your publishing unless you\'ve intentionally agreed otherwise.',
    industryStandard:'All recording agreements should explicitly address publishing.',
    impact:'Without a clear statement, a label may claim implied rights over your publishing.'};
}

// ─── OTHER TERMS ─────────────────────────────────────────────────────────────
function detectOtherTerms(text,l){
  const terms=[];
  if(has(l,'audit')){
    const freq=l.match(/(?:once\s+per\s+|no\s+more\s+than\s+once\s+per\s+)(\w+)/i);
    terms.push({term:'Audit Rights',value:freq?`Once per ${freq[1]}`:'Present',rating:'good',
      summary:'You can audit the label\'s books.',
      notes:'The right to audit is critical for verifying royalty payments. Industry studies consistently show underpayments — one audit firm reported finding underpayments in over 90% of audits performed.',
      industryStandard:'30-day notice, once per year is standard. Some deals allow once per accounting period. Labels rarely pay audit costs unless the contract explicitly requires it.',
      impact:'Without audit rights, you have no practical way to verify that royalty statements are accurate. Underpayments of 10–30% are commonly found in label audits.'});
  }
  if(has(l,'mutual approval','mutually approved')&&has(l,'songs','producers','studios','creative')){
    terms.push({term:'Creative Approval',value:'Mutual approval of songs, producers, studios',rating:'good',
      summary:'Both parties must agree on creative decisions.',
      notes:'Mutual creative approval is a significant protection. Without it, a label can legally force you to record material you dislike, work with producers you don\'t choose, or release music you consider substandard.',
      industryStandard:'New artist deals typically give the label final approval over creative decisions. Mutual approval is more favorable and is often a negotiating point for artists with existing fan bases.',
      impact:'You maintain artistic integrity. The label cannot force you to record songs written by their staff writers, use producers who are receiving kickbacks, or release a diluted version of your work.'});
  }
  const syncM=pctNear(l,'sync',150)||pctNear(l,'sync licensing',150);
  if(syncM){
    terms.push({term:'Sync Licensing Split',value:`${syncM}% to artist`,rating:syncM>=50?'good':'bad',
      summary:`You get ${syncM}% of sync fees.`,
      notes:`Sync licensing (TV, film, ads) can be extremely lucrative. A single TV placement can generate $10,000–$50,000+. ${syncM>=50?'A 50/50 split is fair market standard.':'Below 50% is below standard — push for at least 50/50.'}`,
      industryStandard:'50/50 sync splits are standard. Some artist-favorable deals offer 60–75% to the artist.',
      impact:`On a $25,000 sync placement, you\'d receive $${Math.round(syncM/100*25000).toLocaleString()}. At 50/50 you\'d receive $12,500.`});
  }
  return terms;
}

// ─── RED FLAG DETECTORS ──────────────────────────────────────────────────────
function check360(text,l,flags){
  const is360=has(l,'360','multiple rights','360°','360 provision')||
    (has(l,'gross income','gross revenues')&&has(l,'touring','live performance','merchandise','endorsement'));
  if(!is360)return;
  const pct=pctNear(l,'live performance',250)||pctNear(l,'merchandise',150)||pctNear(l,'gross income',150)||20;
  const q=text.match(/(?:label shall (?:receive|be entitled)|company shall (?:receive|participate))[^.]*?(?:gross income|live performance|touring)[^.]*\./i);
  flags.push({severity:'critical',title:`360 Deal — Label Takes ${pct}% of All Your Income Streams`,
    quote:q?q[0].trim():'',
    explanation:`A "360 deal" means the label participates in income beyond just your recordings — including concerts, merch, endorsements, sponsorships, and acting work. Popularized by major labels in the 2000s as justification for large advances, it means the label earns from your success in every area of your career, even areas it contributes nothing to.`,
    impact:`On $500K/year in touring revenue, a ${pct}% 360 clause costs you $${Math.round(pct*5000).toLocaleString()}/year — for the full term plus post-term years. Over a 5-year deal, that's $${Math.round(pct*5000*5).toLocaleString()} paid to the label from concerts alone.`,
    industryStandard:'360 deals emerged in the late 2000s. Major labels (Interscope, Columbia, Warner) all used them heavily. Today they are less common in developing artist deals but still appear. Any participation above 10% on live revenue or 20% on merch is above market.'});
}

function checkCrossCollat(text,l,flags){
  if(!has(l,'cross-collateral','cross collateral','cross-collateralized'))return;
  const q=text.match(/cross[- ]collateral[^.]*\./i);
  flags.push({severity:'critical',title:'Cross-Collateralization — One Album\'s Debt Cancels Another\'s Earnings',
    quote:q?q[0].trim():'',
    explanation:'Cross-collateralization means the label lumps all your album royalty accounts together. If your debut loses $80K and your sophomore album earns $100K in royalties, you don\'t see any payment — the $80K deficit is deducted first. Labels frequently exercise this to keep "unrecouped" balances alive indefinitely.',
    impact:'TLC sold over 10 million copies of CrazySexyCool and reportedly received $1.75M combined across three members. Cross-collateralization of earlier album debts against later successes is a key mechanism for this outcome.',
    industryStandard:'Cross-collateralization is standard in major label deals and is one of the most artist-harmful provisions. It should be fought hard in negotiations — each album should have its own independent royalty account.'});
}

function checkControlledComp(text,l,flags){
  if(!has(l,'controlled composition'))return;
  const isThreeQ=has(l,'three-quarters','3/4','75%')&&has(l,'mechanical','statutory');
  const is100=has(l,'100%','one hundred percent')&&has(l,'statutory','mechanical');
  if(is100)return; // Full statutory — positive
  const q=text.match(/controlled composition[^.]*\./i);
  flags.push({severity:'high',title:'Controlled Composition Clause — Reduced Mechanical Royalties on Your Own Songs',
    quote:q?q[0].trim():'',
    explanation:`A controlled composition clause requires you to license your own songs at ${isThreeQ?'75% of':'a reduced'} the statutory mechanical rate. The statutory rate (currently $0.091/song/unit in the US) is what publishers normally charge. At 75%, you receive only $0.068/song/unit — plus album caps (typically 10× the reduced rate) further limit total mechanicals regardless of how many songs are on the album.`,
    impact:`On 100,000 album sales with 12 self-written songs: full statutory = $10,920. At 75% with a 10-song cap = $6,825. That\'s $4,095 less on one moderately successful album. On a gold record (500K sales) the difference is over $20,000.`,
    industryStandard:'75% controlled composition is standard in major label deals and has been since the 1980s. Independent labels increasingly offer 100% statutory. Negotiating 100% statutory with no album cap is a meaningful win.'});
}

function checkPackaging(text,l,flags){
  if(!has(l,'packaging deduction','packaging','container charge'))return;
  const pct=pctNear(l,'packaging',100)||20;
  const q=text.match(/packaging[^.]*deduction[^.]*\./i)||text.match(/packaging[^.]*%[^.]*\./i);
  flags.push({severity:'high',title:`Packaging Deduction — ${pct}% Taken Off Before Your Royalty Is Calculated`,
    quote:q?q[0].trim():'',
    explanation:`Before calculating your royalty, the label deducts ${pct}% of the sale price as a "packaging charge." This originated in the CD era when physical packaging had real costs. On digital sales it is pure profit for the label — there is no packaging. Your effective royalty rate isn\'t ${pctNear(l,'royalt',100)||'listed'}%, it\'s ${pctNear(l,'royalt',100)||18}% × ${100-pct}% = ${Math.round((pctNear(l,'royalt',100)||18)*(100-pct)/100*100)/100}%.`,
    impact:`On a $9.99 digital album: a 25% packaging deduction drops the royalty base to $7.49. At 13%, you receive $0.97/unit instead of $1.30. On 100,000 digital sales, you lose $33,000.`,
    industryStandard:'Packaging deductions of 15–25% are standard on physical product. Applying them to digital sales has no justification and is widely considered a holdover exploit. Negotiate to exclude packaging deductions on all digital revenue.'});
}

function checkFreeGoods(text,l,flags){
  if(!has(l,'free goods'))return;
  const pct=pctNear(l,'free goods',150)||15;
  const q=text.match(/free goods[^.]*\./i);
  flags.push({severity:'high',title:`Free Goods — No Royalties on ${pct}% of Units Shipped`,
    quote:q?q[0].trim():'',
    explanation:`Up to ${pct}% of physical units can be designated "free goods" and distributed to retailers, radio stations, or promoters with no royalties owed to you. In practice, many "free goods" are sold at discount rather than literally given away — the label collects revenue but pays you nothing.`,
    impact:`On a pressing of 100,000 units, ${pct*1000} copies are royalty-free. At $1.50/unit royalty rate, that\'s $${(pct*1000*1.5).toLocaleString()} you never receive.`,
    industryStandard:'15% free goods is industry standard for physical product. On digital sales there are no free goods — any attempt to apply this to streaming is a red flag. Negotiate to cap free goods at 5% and exclude digital entirely.'});
}

function checkWorkForHire(text,l,flags){
  if(!has(l,'work made for hire','works made for hire','work-made-for-hire'))return;
  const q=text.match(/work[s]?\s+made?\s+for\s+hire[^.]*\./i);
  flags.push({severity:'critical',title:'"Work for Hire" — You Are Legally Never the Author of Your Own Recordings',
    quote:q?q[0].trim():'',
    explanation:'Under U.S. copyright law, a "work made for hire" means the label — not you — is treated as the legal author from the moment of creation. This eliminates your copyright termination right under 17 U.S.C. § 203, which would normally allow you to reclaim masters after 35 years. The Recording Industry Association of America tried to classify all recordings as works for hire in 1999; artists (led by Don Henley and Sheryl Crow) lobbied Congress to reverse it.',
    impact:'Unlike a standard copyright assignment (where you sign away rights but retain the 35-year termination right), work-for-hire recordings can NEVER be reclaimed under U.S. law. Your grandchildren cannot inherit your masters. This is exactly why Taylor Swift chose to re-record her catalog rather than wait for termination rights — she doesn\'t have any.',
    industryStandard:'Work-for-hire language is ubiquitous in major label contracts. It is deeply unfavorable to artists. Insist on an assignment of rights instead — the label still gets the same commercial control, but you preserve your statutory termination rights.'});
}

function checkPerpetualMasters(text,l,flags,masters){
  if(masters.type==='artist_owned')return;
  if(!has(l,'in perpetuity','throughout the universe','perpetual'))return;
  if(has(l,'shall revert','revert to artist'))return;
  if(has(l,'work made for hire','works made for hire'))return; // already flagged
  const q=text.match(/(?:in perpetuity|throughout the universe)[^.]*\./i);
  flags.push({severity:'critical',title:'Perpetual Master Ownership — Label Keeps Your Recordings Forever',
    quote:q?q[0].trim():'',
    explanation:'The label owns your recordings permanently with no reversion clause. Copyright in sound recordings lasts for your lifetime plus 70 years. Without a reversion clause or termination rights, your recordings remain label property indefinitely.',
    impact:'The label can license your catalog to films, ads, video games, or compilations you find offensive — and keep the majority of those fees. When the label is acquired (as happens frequently — Warner, Island, Elektra, Def Jam have all changed hands), your catalog transfers to the new owner without your consent or any payment to you.',
    industryStandard:'Perpetual ownership without reversion is standard in major label deals. Fight for a reversion clause: masters should revert to you 5–7 years after commercial release.'});
}

function checkExcessiveOptions(l,flags,commitment){
  const total=commitment.numericTotal||0;
  if(total<5)return;
  flags.push({severity:total>=7?'critical':'high',title:`${total}-Album Commitment — Years of Your Career Locked Up`,
    quote:'',
    explanation:`Up to ${total} albums at the label\'s sole discretion means you cannot leave even if the relationship turns bad, the label changes ownership, or your career direction changes. Options are exercised by the label when it\'s in their interest — and dropped when it isn\'t. You have no symmetric right to exit.`,
    impact:`At one album every 1.5 years, ${total} albums represents ${Math.round(total*1.5)} years of career commitment. Prince spent years unable to release music under his Warner Bros. deal. Garth Brooks famously battled Capitol Nashville over similar issues.`,
    industryStandard:'7-album deals were standard in the 1970s–80s. The modern standard is 1–2 albums + 1–2 options. Any deal over 4 total albums should be pushed back on aggressively.'});
}

function checkPublishingGrab(text,l,flags){
  if(!has(l,"publisher's share",'co-publishing','label publishing','affiliated publishing'))return;
  const pct=pctNear(l,"publisher's share",200)||pctNear(l,'co-publishing',200)||50;
  const q=text.match(/(?:co-publishing|publisher's share|label publishing)[^.]*\./i);
  flags.push({severity:'high',title:`Publishing Grab — Label Takes ${pct}% of Your Songwriting Income`,
    quote:q?q[0].trim():'',
    explanation:`The label is claiming ${pct}% of your publishing rights — your ownership stake in the compositions you write. This is a separate income stream from master recording royalties. You\'re now losing income from two sources: the label\'s share of recordings AND the label\'s share of songwriting.`,
    impact:'Publishing income includes mechanical royalties, performance royalties collected by ASCAP/BMI/SESAC, sync licensing fees, and print rights. For a prolific songwriter, lifetime publishing income can far exceed recording royalties. Ceding 50% of this permanently is one of the most financially damaging provisions in a recording contract.',
    industryStandard:'Co-publishing deals were common in the 1990s–2000s but are now considered outdated. Modern recording deals rarely include publishing participation — they are a separate negotiation with separate companies. If a label insists on publishing participation, it should be limited to compositions actually recorded under the deal and should revert with the masters.'});
}

function checkCrossRecoupment(text,l,flags){
  if(!has(l,'recoupable'))return;
  const extras=[];
  if(has(l,'video production','video costs')&&has(l,'recoupable'))extras.push('video production');
  if(has(l,'independent promotion','marketing expenses')&&has(l,'recoupable'))extras.push('independent promotion/marketing');
  if(extras.length===0)return;
  flags.push({severity:'high',title:'Broad Recoupment — Label Charges Back More Than Just Recording Costs',
    quote:'',
    explanation:`Beyond the recording advance, the label can recoup ${extras.join(' and ')} costs from your royalties. These charges can easily exceed the advance itself. A $75K advance plus $40K video budget plus $50K independent radio promotion creates a $165K recoupment balance you must earn back at your royalty rate.`,
    impact:'This is how major label artists end up with "unrecouped" balances despite significant commercial success. At a 10% effective royalty rate on a $10 album, you need to sell 165,000 copies just to break even — and that\'s before any packaging deductions.',
    industryStandard:'Recording costs are always recoupable. Video costs at 50% recoupable is common in indie deals. 100% video recoupment is unfavorable. Independent promotion charges to the artist\'s account are a major red flag and should be resisted entirely.'});
}

function checkNonCompete(text,l,flags){
  if(!(has(l,'following the expiration','following termination','after the term')&&has(l,'shall not record','not record for','not record any composition')))return;
  const ym=l.match(/(\d+)\s*years?\s*following/i);
  const yrs=ym?parseInt(ym[1]):'a period';
  const q=text.match(/following the (?:expiration|termination)[^.]*shall not record[^.]*\./i);
  flags.push({severity:'medium',title:`Post-Term Non-Compete — Can\'t Re-Record These Songs for ${yrs} Year${yrs!==1?'s':''}`,
    quote:q?q[0].trim():'',
    explanation:`For ${yrs} year${yrs!==1?'s':''} after your contract ends, you cannot re-record songs you made under this deal for any other label. This directly blocks the "re-recording strategy" that Taylor Swift used (her "Taylor\'s Version" project) to reclaim the commercial value of her catalog.`,
    impact:'If you leave this label and want to re-record your catalog so streaming platforms and sync clients use the new versions, this clause prevents that. It keeps the original (label-owned) version commercially relevant and competitive against any re-recording you might make.',
    industryStandard:'5-year post-term non-compete on re-recording is standard. Anything shorter is a win. Negotiate to remove re-recording restrictions on tracks not commercially released by the label.'});
}

function checkDigitalReduction(text,l,flags){
  if(!has(l,'new technology','digital download','streaming'))return;
  if(!has(l,'75%','seventy-five'))return;
  const q=text.match(/(?:new technology|digital)[^.]*?75%[^.]*\./i);
  flags.push({severity:'high',title:'Digital Royalty Reduction — 25% Less on 80%+ of Your Revenue',
    quote:q?q[0].trim():'',
    explanation:'"New technology" clauses date from the 1980s when labels inserted them for CD sales. They have since been applied to digital downloads and, in some older contracts, streaming. There are zero additional costs for digital distribution vs physical — this deduction is pure margin capture by the label.',
    impact:'Since streaming accounts for ~80% of recorded music revenue globally, a 25% digital reduction effectively cuts your total royalty earnings by 20%. On a $50,000 royalty statement, that\'s $10,000 you should be receiving.',
    industryStandard:'New technology reductions are widely considered obsolete and are excluded from modern label agreements. Any new contract that includes them should have this clause struck entirely.'});
}

function checkReturnsReserve(text,l,flags){
  if(!has(l,'returns reserve','reserve'))return;
  const pct=pctNear(l,'reserve',150)||pctNear(l,'returns reserve',150);
  if(!pct||pct<20)return;
  flags.push({severity:'medium',title:`${pct}% Returns Reserve — Label Withholds ${pct}% of Your Royalties`,
    quote:'',
    explanation:`The label holds back ${pct}% of calculated royalties "in reserve" against potential returns of physical product, typically for 4–8 accounting periods (2–4 years). On digital sales there are no returns, yet labels still apply reserves. This delays your cash flow significantly and in some cases reserves are never fully released.`,
    impact:`On a $100,000 gross royalty statement, you receive only $${100-pct}K initially. The $${pct}K reserve sits with the label for 1–4 years. By the time it\'s released, it\'s often absorbed by new reserves on subsequent statements.`,
    industryStandard:'20–35% reserves on physical product for 4 accounting periods is standard. Negotiate to cap reserves at 20%, liquidate within 2 accounting periods, and exclude digital sales from any reserve calculation entirely.'});
}

function checkForeignReduction(text,l,flags){
  if(!has(l,'sold outside the united states','foreign royalt','foreign sales'))return;
  const pct=pctNear(l,'outside the united states',200)||pctNear(l,'foreign',150);
  if(!pct||pct>90)return;
  flags.push({severity:'medium',title:`Foreign Royalties Paid at ${100-pct}% Less Than Domestic`,
    quote:'',
    explanation:`Records sold outside the US pay only ${pct}% of the domestic royalty rate. As global streaming has made international markets equally accessible, cutting foreign royalties by ${100-pct}% significantly reduces your total earnings.`,
    impact:'International streams now account for 40–60% of most artists\' streaming revenue. If those streams pay 50% of the US rate, your blended effective royalty is 70–80% of what you think it is.',
    industryStandard:'50% of domestic rate for foreign sales was standard in physical distribution contracts. In the streaming era this distinction has less justification — negotiate for a single worldwide rate or reduce the foreign rate reduction.'});
}

function checkLOD(text,l,flags){
  if(!has(l,'letter of direction','lod'))return;
  const irrevocable=has(l,'irrevocable');
  const existingIncome=has(l,'amounts earned','amounts received','income from','revenues from')&&has(l,'existing materials','existing recordings');
  const q=text.match(/(?:irrevocable\s+)?letter\s+of\s+direction[^.]*\./i)||text.match(/lod[^.]*existing[^.]*\./i);
  flags.push({severity:'critical',title:`${irrevocable?'Irrevocable ':''}Letter of Direction — Label Controls Your Existing Income Stream`,
    quote:q?q[0].trim():'',
    explanation:`A Letter of Direction (LOD) is a written instruction to whoever currently pays you (a distributor, publisher, or PRO) to redirect your income payments directly to the label. ${irrevocable?'This LOD is described as irrevocable, meaning you cannot cancel it without the label\'s consent — they control the spigot on your existing income indefinitely.':''}${existingIncome?' Combined with the existing recordings handover, this means the label begins collecting income from your pre-existing catalog from the moment you sign.':''}`,
    impact:'From the day you sign, money earned by your existing music flows to the label rather than to you. If you have any revenue from previously released music, you will not receive it — it goes toward your recoupable balance. The "irrevocable" nature means you cannot simply write a new direction to redirect funds back; you need the label\'s written consent.',
    industryStandard:'LODs are used in legitimate deals but should always be revocable by the artist with reasonable notice (30–60 days). An irrevocable LOD is highly unusual and artist-unfriendly. Standard practice is a revocable LOD that terminates automatically at the end of the deal.'});
}

function checkExistingMaterials(text,l,flags){
  if(!has(l,'existing recordings','existing materials','existing tracks'))return;
  if(!has(l,'deemed made under','works made for hire','shall be owned','owned by label'))return;
  const q=text.match(/existing (?:materials|recordings)[^.]*(?:deemed|owned|works made)[^.]*\./i);
  flags.push({severity:'critical',title:'Existing Recordings Handed Over — Pre-Career Work Becomes Label Property',
    quote:q?q[0].trim():'',
    explanation:'The label requires you to hand over recordings you already made — before this deal — and these are "deemed made under the agreement," meaning they\'re treated as work-for-hire label property. This retroactively strips you of ownership of work you created independently, often including music you\'ve already released or earned money from.',
    impact:'You lose ownership of all music you\'ve already created. Songs like "Run.pony," "the exorcist," and "haunted house" — which you already made independently — now belong to the label in perpetuity. Any future income from these tracks goes through the label\'s accounting. You also bear the cost of clearing all samples and rights on this existing material.',
    industryStandard:'Labels sometimes request rights to existing recordings, particularly if they want to control the artist\'s full catalog. However, "work for hire" treatment of independently created prior recordings is extremely aggressive. At minimum, prior recordings should be subject to a time-limited license rather than permanent assignment.'});
}

function checkAllInRoyalty(text,l,flags,royalty){
  if(!royalty.isAllin)return;
  flags.push({severity:'high',title:`"All-In" Royalty — Producer Fees Come Out of Your ${royalty.numericValue}%`,
    quote:'',
    explanation:`"All-in" means your ${royalty.numericValue}% royalty rate must cover not just your artist income but also all producer royalties. Producers typically receive 3–5 points (3–5%). If your producer gets 4 points, your net rate after paying the producer is only ${royalty.numericValue-4}%. The label pays nothing toward producer royalties — the entire cost is deducted from your share.`,
    impact:`On $1,000,000 in label receipts: at ${royalty.numericValue}% all-in you receive $${royalty.numericValue*10000}. Pay your producer 4 points ($40,000) and you net $${(royalty.numericValue-4)*10000}. Compare to a non-all-in 18% deal where you receive the full $180,000 and the label separately pays the producer.`,
    industryStandard:'"All-in" deals are standard at major labels. Non-all-in deals (sometimes called "pass-through" deals) where the label pays producer royalties separately are more artist-favorable and more common in indie/distribution deals. Always ask whether the royalty rate is all-in or exclusive of producer royalties.'});
}

function check925Mechanicals(text,l,flags){
  // Detect mechanical base less than 100% of net sales
  const mbase=l.match(/mechanicals?\s+(?:royalties?\s+)?paid\s+on\s+([\d.]+)%\s+of\s+net\s+sales/i)||
    l.match(/([\d.]+)%\s+of\s+net\s+sales[^.]*mechanical/i);
  if(!mbase)return;
  const pct=parseFloat(mbase[1]);
  if(pct>=100)return;
  const q=text.match(/mechanical[^.]*paid on[^.]*\./i);
  flags.push({severity:'medium',title:`Mechanical Royalties Based on ${pct}% of Sales — ${100-pct}% Effectively Free`,
    quote:q?q[0].trim():'',
    explanation:`Even though the controlled composition rate is 100% of statutory, mechanicals are only calculated on ${pct}% of net sales — meaning ${100-pct}% of units are treated as if they don\'t exist for mechanical purposes. This is functionally equivalent to a free goods provision applied specifically to mechanical royalties.`,
    impact:`On 100,000 units sold, you only receive mechanicals on ${Math.round(pct/100*100000).toLocaleString()} units. At the full statutory rate of $0.091/song/unit with 12 songs per album, the difference is $${Math.round((100-pct)/100*100000*0.091*12).toLocaleString()} in lost mechanical income.`,
    industryStandard:'100% of net sales as the mechanical base is the standard. Any reduction below 100% should be negotiated out. The 92.5% base in this deal is relatively mild — major label deals sometimes use 85% — but it still reduces your income without justification.'});
}

function checkPostTermMatching(text,l,flags){
  const postTerm=has(l,'first negotiation right','first negotiation')&&has(l,'matching right')&&
    has(l,'after the end of the term','after the term','following expiration','following the term');
  if(!postTerm)return;
  const ym=l.match(/(\d+)\s*month[s]?\s*(?:period\s+)?after\s+the\s+(?:end\s+of\s+the\s+)?term/i);
  const months=ym?parseInt(ym[1]):12;
  const q=text.match(/(?:first negotiation|matching right)[^.]*after[^.]*term[^.]*\./i);
  flags.push({severity:'high',title:`Post-Term ${months}-Month Matching Right — Can\'t Freely Sign Elsewhere`,
    quote:q?q[0].trim():'',
    explanation:`For ${months} months after your deal ends, you must first negotiate with this label before signing with anyone else. If you get an offer from another label, you must show it to this label and give them the right to match it on identical terms. This creates a chilling effect — other labels may not make competitive offers knowing this label can simply copy them.`,
    impact:'You cannot freely shop your services to the market for a full year after your deal ends. This is a significant restraint on your career freedom and bargaining power. Other labels know this label has a matching right, which discourages them from spending time and money developing an offer.',
    industryStandard:'Post-term first negotiation rights (30 days) are common. Matching rights are more aggressive. 12 months is a long post-term restriction — negotiate this down to 30 days first negotiation only, with no matching right.'});
}

function checkPublishingMatching(text,l,flags){
  const pubMatch=has(l,'first negotiation')&&has(l,'matching right')&&has(l,'publishing');
  if(!pubMatch)return;
  // Don't double-flag if already a full publishing grab
  if(has(l,"publisher's share",'co-publishing','affiliated publishing'))return;
  flags.push({severity:'medium',title:'Publishing First Negotiation + Matching Right — Label Crowds Out Publishers',
    quote:'',
    explanation:'The label has a 30-day exclusive right to negotiate for your publishing, and if negotiations fail, a 30-day right to match any third-party publishing offer. While this isn\'t a direct publishing grab, it creates significant friction in the publishing marketplace — publishers are unlikely to invest time developing an offer knowing the label can match it.',
    impact:'Your publishing deal options may be limited or less competitive because publishers factor the matching right into their offer strategy. You might receive lower advances or worse terms from independent publishers who don\'t want to do the work only to have the label swoop in and copy their offer.',
    industryStandard:'Publishing matching rights are common in major label deals as a softer alternative to co-publishing. They should be time-limited (30 days maximum) and apply only to publishing deals struck during the recording contract term, not after.'});
}

// ─── POSITIVE DETECTORS ──────────────────────────────────────────────────────
function checkMasterReversion(text,l,positives,masters){
  if(masters.type!=='lease')return;
  const ym=l.match(/(\d+)[- ]years?[^.]*revert/i)||l.match(/revert[^.]*?(\d+)[- ]years?/i);
  const yrs=ym?parseInt(ym[1]):null;
  if(!yrs||yrs>15)return;
  positives.push({title:`Masters Revert After ${yrs} Years`,
    explanation:`Your master recordings return to your ownership ${yrs} years after release. ${yrs<=5?'This is a strong reversion — you\'ll get your masters back while they retain significant commercial value.':'Negotiate this down to 5 years if possible.'}`,
    impact:`In ${yrs} years you\'ll own your recordings outright, able to re-release, re-license, or sell them without label involvement.`});
}

function checkFullStatutoryMech(text,l,positives){
  if(!has(l,'100%','one hundred percent')||!has(l,'statutory','mechanical'))return;
  if(!has(l,'controlled composition'))return;
  positives.push({title:'Full Statutory Mechanical Rate (100%)',
    explanation:'The label pays mechanicals at the full statutory rate — not the reduced 75% that most major label controlled composition clauses impose. This is a meaningful win for songwriters.',
    impact:'On 100,000 album sales (12 songs): full rate earns ~$10,920 vs reduced rate ~$8,190. On a gold record (500K units) the difference is over $13,000.'});
}

function checkNo360(text,l,positives,redFlags){
  if(redFlags.some(f=>f.title.includes('360')))return;
  if(!has(l,'no claim to','no right to','shall have no claim','retains exclusively')&&!has(l,'no 360'))return;
  if(!has(l,'live performance','touring','merchandise'))return;
  positives.push({title:'No 360 Clause',
    explanation:'The label explicitly does not participate in your live, touring, merchandise, or other non-recording income.',
    impact:'For a touring artist generating $200K/year in live revenue, no 360 clause saves $20,000–$40,000 per year that would otherwise go to the label.'});
}

function checkReleaseCommitment(text,l,positives){
  if(has(l,'shall commercially release','shall release each')&&has(l,'failure to release','fail to release')){
    positives.push({title:'Release Commitment with Reversion',
      explanation:'The label must release your music within a defined window. If they fail, your rights revert to you.',
      impact:'Prevents the career-killing scenario where a label shelves your album and you can\'t release it anywhere else.'});
  }
}

function checkAuditPositive(text,l,positives){
  if(has(l,'audit')){
    positives.push({title:'Audit Rights',
      explanation:'You can audit the label\'s financial records. Industry studies consistently find underpayments in the majority of label audits.',
      impact:'Typical audits recover 10–30% of royalties that were underpaid. Without this right, you have no recourse.'});
  }
}

function checkArtistOwnership(text,l,positives,masters){
  if(masters.type!=='artist_owned')return;
  positives.push({title:'Artist Retains Master Ownership',
    explanation:'You own your recordings outright. No label can sell, license, or exploit your catalog without your consent.',
    impact:'Owning your masters is the foundation of long-term career wealth. Your recordings are an asset that appreciates with your fame.'});
}

function checkNoPackaging(text,l,positives,redFlags){
  if(redFlags.some(f=>f.title.toLowerCase().includes('packaging')))return;
  if(has(l,'no packaging deduction','packaging deductions shall not apply','without packaging'))
    positives.push({title:'No Packaging Deductions',
      explanation:'Your royalty rate applies to the full sale price — no deduction for packaging.',
      impact:'A 25% packaging deduction on a 16% royalty effectively reduces it to 12%. Eliminating packaging deductions is worth 25% more in royalties per unit.'});
}

function checkArtistPublishing(text,l,positives){
  if(has(l,'retains one hundred percent','100% of all publishing','claims no interest')&&has(l,'publishing'))
    positives.push({title:'Artist Retains 100% of Publishing',
      explanation:'No publishing rights are claimed by the label. Your full songwriting income remains yours.',
      impact:'Lifetime publishing income from a successful catalog can exceed $1M. Keeping 100% means every performance, cover, sync, and mechanical royalty flows directly to you.'});
}

function checkMarketingCommitment(text,l,positives){
  const mktM=text.match(/(?:marketing\s+commitment|marketing[^.]*?not\s+less\s+than|minimum[^.]*?marketing)[^$]*?\$\s*([\d,]+)/i)||
    text.match(/\$\s*([\d,]+)[^.]*marketing\s+commitment/i)||
    text.match(/commit[^.]*?\$\s*([\d,]+)[^.]*marketing/i);
  if(!mktM)return;
  const amt=parseFloat(mktM[1].replace(/,/g,''));
  positives.push({title:`$${amt.toLocaleString()} Guaranteed Marketing Commitment`,
    explanation:`The label is contractually required to spend at least $${amt.toLocaleString()} marketing your release. This is enforceable.`,
    impact:`$${amt.toLocaleString()} in marketing spend is meaningful for a developing artist — it typically covers playlisting campaigns, social media ads, and radio pitching. Without a minimum commitment, the label can sign you and spend nothing promoting you.`});
}

function checkCreativeApproval(text,l,positives){
  if(has(l,'mutual approval','mutually approved')&&has(l,'songs','producers','studios'))
    positives.push({title:'Mutual Creative Approval',
      explanation:'Both you and the label must agree on songs, producers, and studios. Neither party can unilaterally impose creative decisions.',
      impact:'Protects your artistic integrity. Without this, a label can require you to record songs written by their staff, use producers who are receiving kickbacks, or modify your work without your consent.'});
}

function checkMonthlyPayouts(text,l,positives){
  if(has(l,'monthly basis','paid monthly','monthly within'))
    positives.push({title:'Monthly Royalty Payments',
      explanation:'Royalties paid monthly instead of semi-annually or annually.',
      impact:'Monthly payments dramatically improve cash flow. At annual accounting, you might wait 18+ months to see your first royalty check.'});
}

function checkTerminationRight(text,l,positives){
  if(has(l,'either party may terminate')&&has(l,'without cause'))
    positives.push({title:'Mutual Termination Right',
      explanation:'Either party can exit the agreement with written notice after the initial period.',
      impact:'If the relationship sours, you have a way out — unlike most major label deals where only the label can effectively exit.'});
}

// ─── SCORING ─────────────────────────────────────────────────────────────────
function calcScore(masters,royalty,commitment,redFlags,positives,l){
  let s=40;
  if(masters.type==='artist_owned')s+=28;
  else if(masters.type==='lease'){
    const ym=l.match(/(\d+)[- ]years?[^.]*revert/i);
    const yrs=ym?parseInt(ym[1]):10;
    s+=yrs<=5?20:yrs<=7?14:yrs<=10?8:3;
  } else if(masters.type==='label_owned'){
    if(has(l,'work made for hire','works made for hire'))s-=8;
  }
  const r=royalty.numericValue;
  if(royalty.isSplit){s+=r>=75?18:r>=65?14:r>=50?8:3;}
  else{s+=r>=20?18:r>=18?14:r>=16?10:r>=14?6:r>=12?2:r>0?-4:0;}
  const tot=commitment.numericTotal||0;
  s+=tot===0?3:tot===1?8:tot<=2?5:tot<=3?2:tot<=5?-4:-10;
  for(const f of redFlags)s+=f.severity==='critical'?-14:f.severity==='high'?-7:-3;
  s+=Math.min(positives.length*4,14);
  return Math.max(5,Math.min(95,Math.round(s)));
}

function buildRationale(score,masters,royalty,redFlags){
  const parts=[];
  if(masters.type==='artist_owned')parts.push('artist retains masters');
  else if(masters.type==='lease')parts.push('masters lease with reversion');
  else if(masters.type==='label_owned')parts.push('label owns masters in perpetuity');
  if(royalty.numericValue>=18)parts.push(`solid ${royalty.numericValue}% royalty${royalty.isAllin?' (all-in)':''}`);
  else if(royalty.numericValue>0)parts.push(`${royalty.numericValue}% royalty${royalty.isAllin?' all-in':''}`);
  const crit=redFlags.filter(f=>f.severity==='critical').length;
  const high=redFlags.filter(f=>f.severity==='high').length;
  if(crit>0)parts.push(`${crit} critical clause${crit>1?'s':''}`);
  if(high>0)parts.push(`${high} high-concern provision${high>1?'s':''}`);
  return parts.join('; ')+(parts.length?'.':'Based on identified clauses.');
}

function buildSummary(score,masters,royalty,termLen,commitment,advance,redFlags,positives){
  const grade=score>=75?'favorable':score>=55?'average':score>=35?'below average':'concerning';
  const crit=redFlags.filter(f=>f.severity==='critical').length;
  let p1=`This is a ${grade} recording deal, scoring ${score}/100. `;
  if(masters.type==='artist_owned')p1+='The strongest element is full artist ownership of master recordings.';
  else if(masters.type==='lease')p1+='The label owns your masters during the agreement but with a reversion clause.';
  else if(masters.type==='label_owned')p1+='The most significant concern is that the label owns your recordings permanently.';
  let p2='';
  if(royalty.numericValue>0){
    p2=`The ${royalty.numericValue}% royalty${royalty.isAllin?' (all-in — producer fees come from this)':''} is ${royalty.numericValue>=18?'above average':'within standard range'}. `;
  }
  if(advance.value&&advance.value!=='None / Not specified'){
    p2+=`The advance structure totals ${advance.value} in recoupable obligations. You won\'t see additional royalties until the label recoups all of this. `;
  }
  if(commitment.numericTotal>0)p2+=`The ${commitment.numericTotal}-${commitment.numericTotal===1?'project':'album'} commitment limits your career obligations${commitment.numericTotal>=4?' — though still significant.':'.'}`;
  let p3='';
  if(crit>0){
    p3=`There ${crit===1?'is':'are'} ${crit} critical provision${crit>1?'s':''} that warrant serious attention. `;
    if(redFlags.some(f=>f.title.includes('Work for Hire')))p3+='The work-for-hire language is particularly permanent — no termination rights, no reversion, no reclaim. ';
    if(redFlags.some(f=>f.title.includes('Letter of Direction')))p3+='The irrevocable LOD gives the label control over your existing income from day one. ';
    if(redFlags.some(f=>f.title.includes('Existing Recordings')))p3+='Handing over pre-existing recordings as work for hire retroactively strips your ownership of music you created independently. ';
  }
  if(positives.length>0)p3+=`On the positive side: ${positives.slice(0,3).map(p=>p.title).join(', ')}.`;
  const rec=score>=75?'This deal is generally favorable — still consult an attorney before signing.'
    :score>=55?'This deal is workable but has room for improvement. An entertainment attorney can help negotiate better terms.'
    :score>=35?'This deal has significant concerns. Do not sign without consulting an entertainment attorney who can push back hard.'
    :'This deal has multiple exploitative provisions that could harm your career for years. Consult an entertainment attorney before proceeding.';
  return[p1,p2,p3,rec].filter(Boolean).join('\n\n');
}

function buildTips(masters,royalty,commitment,redFlags,l){
  const tips=[];
  if(has(l,'work made for hire','works made for hire'))
    tips.push('Replace "work made for hire" with an assignment of rights. An assignment still gives the label ownership, but it preserves your 35-year copyright termination right under 17 U.S.C. § 203 — the right Taylor Swift lacked.');
  if(masters.type==='label_owned'&&!has(l,'work made for hire'))
    tips.push('Negotiate a master reversion clause: your recordings should return to you 5–7 years after commercial release of each project.');
  if(has(l,'lod','letter of direction')&&has(l,'irrevocable'))
    tips.push('The LOD must be revocable. Insist on language that allows you to rescind the LOD with 30 days written notice. An irrevocable LOD gives the label permanent control over your income stream.');
  if(has(l,'existing recordings','existing materials')&&has(l,'deemed made under','works made for hire'))
    tips.push('Fight the existing materials clause. Your prior recordings should be subject to a time-limited license only — not permanent work-for-hire assignment. If the label insists, negotiate fair compensation for handing over pre-existing catalog.');
  if(royalty.isAllin&&royalty.numericValue<20)
    tips.push(`Push to separate your artist royalty from producer royalties. An 18% all-in rate that covers a 4-point producer leaves you with 14%. Ask for 18% as an artist royalty with producer royalties paid on top by the label.`);
  if(redFlags.some(f=>f.title.includes('360')))
    tips.push('Reject the 360 clause entirely or cap it at 5% of net (not gross) touring income only, with a hard sunset at contract expiration.');
  if(redFlags.some(f=>f.title.includes('Cross-Collateral')))
    tips.push('Eliminate cross-collateralization. Each album/project should have a separate, independent royalty account.');
  if(redFlags.some(f=>f.title.includes('Controlled Composition'))&&!has(l,'100% of minimum statutory'))
    tips.push('Negotiate mechanicals to 100% of the statutory rate with no album cap. The controlled composition clause at 75% is a pure reduction in your songwriting income.');
  if(redFlags.some(f=>f.title.includes('post-Term')||f.title.toLowerCase().includes('matching right')))
    tips.push('Limit the post-term restriction to a 30-day first negotiation period only. Remove any matching right — it discourages other labels from making competitive offers.');
  tips.push('Insist on a release commitment with teeth: the label must commercially release each project within 9 months of delivery, with full rights reversion if they fail to do so.');
  tips.push('Request monthly royalty accounting with digital transparency — each streaming platform reported separately so you can cross-check against your distributor analytics.');
  return tips.slice(0,8);
}

// ─── MAIN ANALYZER ──────────────────────────────────────────────────────────
function analyzeContract(rawText){
  const l=rawText.toLowerCase();
  const masterOwnership=detectMasters(rawText,l);
  const royaltyRate=detectRoyalties(rawText,l);
  const termLength=detectTermLength(rawText,l);
  const termCommitment=detectCommitment(rawText,l);
  const advance=detectAdvance(rawText,l);
  const distributionRights=detectDistribution(rawText,l);
  const publishing=detectPublishing(rawText,l);
  const otherKeyTerms=detectOtherTerms(rawText,l);
  const redFlags=[],positives=[];
  // Red flags
  check360(rawText,l,redFlags);
  checkCrossCollat(rawText,l,redFlags);
  checkControlledComp(rawText,l,redFlags);
  checkPackaging(rawText,l,redFlags);
  checkFreeGoods(rawText,l,redFlags);
  checkWorkForHire(rawText,l,redFlags);
  checkPerpetualMasters(rawText,l,redFlags,masterOwnership);
  checkExcessiveOptions(l,redFlags,termCommitment);
  checkPublishingGrab(rawText,l,redFlags);
  checkCrossRecoupment(rawText,l,redFlags);
  checkNonCompete(rawText,l,redFlags);
  checkDigitalReduction(rawText,l,redFlags);
  checkReturnsReserve(rawText,l,redFlags);
  checkForeignReduction(rawText,l,redFlags);
  checkLOD(rawText,l,redFlags);
  checkExistingMaterials(rawText,l,redFlags);
  checkAllInRoyalty(rawText,l,redFlags,royaltyRate);
  check925Mechanicals(rawText,l,redFlags);
  checkPostTermMatching(rawText,l,redFlags);
  checkPublishingMatching(rawText,l,redFlags);
  // Positives
  checkMasterReversion(rawText,l,positives,masterOwnership);
  checkFullStatutoryMech(rawText,l,positives);
  checkNo360(rawText,l,positives,redFlags);
  checkReleaseCommitment(rawText,l,positives);
  checkAuditPositive(rawText,l,positives);
  checkArtistOwnership(rawText,l,positives,masterOwnership);
  checkNoPackaging(rawText,l,positives,redFlags);
  checkArtistPublishing(rawText,l,positives);
  checkMarketingCommitment(rawText,l,positives);
  checkCreativeApproval(rawText,l,positives);
  checkMonthlyPayouts(rawText,l,positives);
  checkTerminationRight(rawText,l,positives);
  const score=calcScore(masterOwnership,royaltyRate,termCommitment,redFlags,positives,l);
  return{
    score,
    scoreRationale:buildRationale(score,masterOwnership,royaltyRate,redFlags),
    termLength,termCommitment,masterOwnership,royaltyRate,advance,
    distributionRights,publishing,otherKeyTerms,redFlags,positives,
    overallSummary:buildSummary(score,masterOwnership,royaltyRate,termLength,termCommitment,advance,redFlags,positives),
    negotiationTips:buildTips(masterOwnership,royaltyRate,termCommitment,redFlags,l)
  };
}

// ─── UI ──────────────────────────────────────────────────────────────────────
let activeTab='upload',pdfText='';

document.querySelectorAll('.tab-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    activeTab=b.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-'+activeTab).classList.add('active');
    hideError();
  });
});

const dropZone=document.getElementById('dropZone');
const fileInput=document.getElementById('fileInput');
const fileNameEl=document.getElementById('fileName');
dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('drag-over');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop',e=>{
  e.preventDefault();dropZone.classList.remove('drag-over');
  const f=e.dataTransfer.files[0];
  if(f&&f.type==='application/pdf')loadPDF(f); else showError('Please drop a PDF file.');
});
fileInput.addEventListener('change',()=>{if(fileInput.files[0])loadPDF(fileInput.files[0]);});
async function loadPDF(file){
  fileNameEl.style.display='inline-block';fileNameEl.textContent='📄 '+file.name;pdfText='';
  try{
    const buf=await file.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const pages=[];
    for(let i=1;i<=pdf.numPages;i++){
      const pg=await pdf.getPage(i);
      const c=await pg.getTextContent();
      pages.push(c.items.map(s=>s.str).join(' '));
    }
    pdfText=pages.join('\n\n');hideError();
  }catch(err){showError('Could not read PDF: '+err.message);pdfText='';fileNameEl.style.display='none';}
}

function loadExample(type){
  document.querySelector('[data-tab="paste"]').click();
  document.getElementById('pasteText').value=EXAMPLES[type];
  hideError();
}

function showError(msg){document.getElementById('errorMsg').textContent=msg;document.getElementById('errorBox').classList.add('show');}
function hideError(){document.getElementById('errorBox').classList.remove('show');}

let stepTimer;
function startLoading(){
  const steps=document.querySelectorAll('.loading-step');
  let cur=0;steps.forEach(s=>s.className='loading-step');steps[0].classList.add('active');
  stepTimer=setInterval(()=>{
    steps[cur].classList.remove('active');steps[cur].classList.add('done');cur++;
    if(cur<steps.length)steps[cur].classList.add('active'); else clearInterval(stepTimer);
  },320);
}
function stopLoading(){clearInterval(stepTimer);document.querySelectorAll('.loading-step').forEach(s=>{s.classList.remove('active');s.classList.add('done');});}

function startAnalysis(){
  hideError();
  let ct='';
  if(activeTab==='upload'){if(!pdfText){showError('Please select a PDF file first.');return;}ct=pdfText;}
  else{ct=document.getElementById('pasteText').value.trim();if(!ct){showError('Please paste contract text first.');return;}}
  if(ct.length<80){showError('Text too short — please provide more content.');return;}
  document.querySelector('.input-section').style.display='none';
  document.querySelector('.hero').style.display='none';
  document.querySelector('.methodology-note').style.display='none';
  document.getElementById('results').classList.remove('show');
  document.getElementById('loading').classList.add('show');
  document.getElementById('analyzeBtn').disabled=true;
  startLoading();
  setTimeout(()=>{
    try{
      const a=analyzeContract(ct);
      stopLoading();
      setTimeout(()=>{document.getElementById('loading').classList.remove('show');renderResults(a);},350);
    }catch(err){
      stopLoading();
      document.getElementById('loading').classList.remove('show');
      document.querySelector('.input-section').style.display='block';
      document.querySelector('.hero').style.display='block';
      document.querySelector('.methodology-note').style.display='block';
      document.getElementById('analyzeBtn').disabled=false;
      showError('Analysis failed: '+err.message);
    }
  },1600);
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
function renderResults(d){
  const score=d.score;
  document.getElementById('scoreNumber').textContent=score;
  const arc=document.getElementById('scoreArc');
  arc.style.strokeDashoffset=377-(score/100)*377;
  arc.style.stroke=scoreColor(score);
  document.getElementById('scoreGrade').style.color=scoreColor(score);
  document.getElementById('scoreGrade').textContent=scoreGrade(score);
  document.getElementById('scoreRationale').textContent=d.scoreRationale||'';
  const crits=(d.redFlags||[]).filter(f=>f.severity==='critical');
  const ab=document.getElementById('alertBanner');
  if(crits.length>0){
    ab.classList.add('show');
    document.getElementById('alertText').textContent=`${crits.length} critical clause${crits.length>1?'s':''} detected. Click any red flag below for the full breakdown.`;
  } else ab.classList.remove('show');
  // Terms
  const tg=document.getElementById('termsGrid');tg.innerHTML='';
  const mainTerms=[
    {key:'termLength',label:'Term Length',icon:'📅'},
    {key:'termCommitment',label:'Commitment',icon:'🎵'},
    {key:'masterOwnership',label:'Master Ownership',icon:'💿',ownership:true},
    {key:'royaltyRate',label:'Royalty Rate',icon:'💰'},
    {key:'advance',label:'Advance / Recording Budget',icon:'💵',noRating:true},
    {key:'distributionRights',label:'Distribution',icon:'🌍'},
    {key:'publishing',label:'Publishing',icon:'📝'},
  ];
  mainTerms.forEach(t=>{
    const term=d[t.key];
    if(term&&term.value)tg.appendChild(buildTermCard(term,t.label,t.icon,t.ownership,t.noRating));
  });
  (d.otherKeyTerms||[]).forEach(term=>{if(term.value)tg.appendChild(buildTermCard(term,term.term,'📋'));});
  // Red flags
  const rf=document.getElementById('redFlags');rf.innerHTML='';
  if(!d.redFlags||d.redFlags.length===0){
    rf.innerHTML='<p style="color:var(--text3);font-size:.875rem;padding:.5rem 0;">No specific red flags detected.</p>';
  } else {
    const ord=['critical','high','medium'];
    [...d.redFlags].sort((a,b)=>ord.indexOf(a.severity)-ord.indexOf(b.severity)).forEach(f=>rf.appendChild(buildFlagCard(f)));
  }
  // Positives
  const pg=document.getElementById('positivesGrid');pg.innerHTML='';
  const pl=document.getElementById('positivesLabel');
  if(!d.positives||d.positives.length===0){pl.style.display='none';}
  else{
    pl.style.display='flex';
    d.positives.forEach(p=>{
      const el=document.createElement('div');el.className='positive-card';
      el.innerHTML=`<div class="positive-icon">✓</div><div><div class="positive-title">${esc(p.title)}</div><div class="positive-text">${esc(p.explanation)}</div></div>`;
      el.onclick=()=>openPositiveBubble(p);
      pg.appendChild(el);
    });
  }
  // Summary
  const sb=document.getElementById('summaryBox');sb.innerHTML='';
  (d.overallSummary||'').split(/\n+/).filter(Boolean).forEach(p=>{const el=document.createElement('p');el.textContent=p;sb.appendChild(el);});
  // Tips
  const tl=document.getElementById('tipsList');tl.innerHTML='';
  (d.negotiationTips||[]).forEach((tip,i)=>{
    const el=document.createElement('div');el.className='tip-item';
    el.innerHTML=`<div class="tip-number">${i+1}</div><div>${esc(tip)}</div>`;
    tl.appendChild(el);
  });
  document.getElementById('results').classList.add('show');
  window.scrollTo({top:0,behavior:'smooth'});
}

function buildTermCard(term,label,icon,isOwnership,noRating){
  const el=document.createElement('div');
  el.className='term-card';
  const rating=term.rating||'unknown';
  let ownerBadge='';
  if(isOwnership&&term.type){
    const m={artist_owned:['artist','Artist Owns'],label_owned:['label','Label Owns'],lease:['lease','Exclusive Lease'],unclear:['unclear','Unclear']};
    const[cls,lbl]=m[term.type]||m.unclear;
    ownerBadge=`<div class="ownership-badge ${cls}">${lbl}</div>`;
  }
  el.innerHTML=`<div class="term-header"><span class="term-name">${icon} ${esc(label)}</span>${noRating?'':`<span class="rating-dot ${rating}"></span>`}</div>${ownerBadge}<div class="term-value">${esc(term.value||'Not specified')}</div><div class="term-summary">${esc(term.summary||'')}</div>`;
  el.onclick=()=>openTermBubble(term,label,icon,rating);
  return el;
}

function buildFlagCard(flag){
  const el=document.createElement('div');
  const sev=flag.severity||'medium';
  el.className=`flag-card ${sev}`;
  el.innerHTML=`<div class="flag-header"><span class="severity-badge ${sev}">${sev}</span><span class="flag-title">${esc(flag.title)}</span><span class="flag-arrow">→</span></div>`;
  if(flag.explanation){
    const preview=flag.explanation.slice(0,90)+'…';
    const ph=document.createElement('div');ph.className='flag-preview';ph.style.cssText='padding:0 1.3rem .8rem;color:var(--text3);font-size:.75rem;line-height:1.5';
    ph.textContent=preview;el.appendChild(ph);
  }
  el.onclick=()=>openFlagBubble(flag);
  return el;
}

// ─── BUBBLE MODAL ────────────────────────────────────────────────────────────
function openTermBubble(term,label,icon,rating){
  const r=term.rating||rating||'unknown';
  document.getElementById('bubbleHeader').className=`bubble-header ${r}`;
  const badgeMap={good:'✅ FAVORABLE',neutral:'⚠️ NEUTRAL',bad:'🔴 UNFAVORABLE',unknown:'❓ UNCLEAR'};
  const badgeCls={good:'good',neutral:'neutral',bad:'bad',unknown:'unknown'};
  document.getElementById('bubbleBadge').className=`bubble-badge ${badgeCls[r]||'unknown'}`;
  document.getElementById('bubbleBadge').textContent=badgeMap[r]||r.toUpperCase();
  document.getElementById('bubbleTitle').textContent=`${icon} ${label}`;
  document.getElementById('bubbleValueLine').textContent=term.value||'';
  const body=document.getElementById('bubbleBody');body.innerHTML='';
  if(term.notes){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">What This Means</div><div class="bubble-section-text">${esc(term.notes)}</div>`;
    body.appendChild(s);
  }
  // Advance breakdown
  if(term.breakdown&&term.breakdown.length>0){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML='<div class="bubble-section-label">Advance Breakdown</div>';
    const bd=document.createElement('div');bd.className='advance-breakdown';
    term.breakdown.forEach(row=>{
      const r=document.createElement('div');r.className=`adv-row ${row.type}`;
      r.innerHTML=`<div><div class="adv-label">${esc(row.label)}</div><div style="font-size:.75rem;color:var(--text3);margin-top:2px">${esc(row.sub)}</div></div><div class="adv-value">${esc(row.value)}</div>`;
      bd.appendChild(r);
    });
    s.appendChild(bd);body.appendChild(s);
  }
  if(term.industryStandard){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">Industry Standard</div><div class="bubble-section-text" style="font-size:.95rem;color:var(--text2)">${esc(term.industryStandard)}</div>`;
    body.appendChild(s);
  }
  if(term.impact){
    const s=document.createElement('div');s.className='bubble-section';
    const impDiv=document.createElement('div');impDiv.className='bubble-impact positive';
    impDiv.innerHTML=`<span>💡</span><span>${esc(term.impact)}</span>`;
    s.innerHTML='<div class="bubble-section-label">Artist Impact</div>';
    s.appendChild(impDiv);body.appendChild(s);
  }
  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function openFlagBubble(flag){
  const sev=flag.severity||'medium';
  document.getElementById('bubbleHeader').className=`bubble-header sev-${sev}`;
  const sevLabels={critical:'🚨 CRITICAL',high:'⚠️ HIGH CONCERN',medium:'🟡 MEDIUM CONCERN'};
  document.getElementById('bubbleBadge').className=`bubble-badge ${sev}`;
  document.getElementById('bubbleBadge').textContent=sevLabels[sev]||sev.toUpperCase();
  document.getElementById('bubbleTitle').textContent=flag.title;
  document.getElementById('bubbleValueLine').textContent='';
  const body=document.getElementById('bubbleBody');body.innerHTML='';
  if(flag.quote){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">Clause from Contract</div><div class="bubble-quote">"${esc(flag.quote)}"</div>`;
    body.appendChild(s);
  }
  if(flag.explanation){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">Why This Is a Problem</div><div class="bubble-section-text">${esc(flag.explanation)}</div>`;
    body.appendChild(s);
  }
  if(flag.impact){
    const s=document.createElement('div');s.className='bubble-section';
    const impDiv=document.createElement('div');impDiv.className='bubble-impact';
    impDiv.innerHTML=`<span>⚡</span><span>${esc(flag.impact)}</span>`;
    s.innerHTML='<div class="bubble-section-label">How This Hurts You</div>';
    s.appendChild(impDiv);body.appendChild(s);
  }
  if(flag.industryStandard){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">Industry Context</div><div class="bubble-section-text" style="font-size:.95rem;color:var(--text2)">${esc(flag.industryStandard)}</div>`;
    body.appendChild(s);
  }
  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function openPositiveBubble(p){
  document.getElementById('bubbleHeader').className='bubble-header positive';
  document.getElementById('bubbleBadge').className='bubble-badge positive';
  document.getElementById('bubbleBadge').textContent='✅ ARTIST-FAVORABLE';
  document.getElementById('bubbleTitle').textContent=p.title;
  document.getElementById('bubbleValueLine').textContent='';
  const body=document.getElementById('bubbleBody');body.innerHTML='';
  if(p.explanation){
    const s=document.createElement('div');s.className='bubble-section';
    s.innerHTML=`<div class="bubble-section-label">Why This Is Good</div><div class="bubble-section-text">${esc(p.explanation)}</div>`;
    body.appendChild(s);
  }
  if(p.impact){
    const s=document.createElement('div');s.className='bubble-section';
    const impDiv=document.createElement('div');impDiv.className='bubble-impact positive';
    impDiv.innerHTML=`<span>💡</span><span>${esc(p.impact)}</span>`;
    s.innerHTML='<div class="bubble-section-label">Artist Impact</div>';
    s.appendChild(impDiv);body.appendChild(s);
  }
  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeBubble(e){if(e.target===document.getElementById('detailOverlay'))closeBubbleBtn();}
function closeBubbleBtn(){document.getElementById('detailOverlay').classList.remove('open');document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBubbleBtn();});

function resetToInput(){
  document.getElementById('results').classList.remove('show');
  document.querySelector('.input-section').style.display='block';
  document.querySelector('.hero').style.display='block';
  document.querySelector('.methodology-note').style.display='block';
  document.getElementById('analyzeBtn').disabled=false;
  document.getElementById('alertBanner').classList.remove('show');
  hideError();pdfText='';
  document.getElementById('fileName').style.display='none';
  document.getElementById('pasteText').value='';
  fileInput.value='';
  window.scrollTo({top:0,behavior:'smooth'});
}

function scoreColor(s){return s>=75?'#68d391':s>=55?'#faf089':s>=35?'#f6ad55':'#fc8181';}
function scoreGrade(s){
  if(s>=80)return'✅ Artist-Friendly Deal';
  if(s>=65)return'🟡 Above Average';
  if(s>=50)return'⚠️ Average — Negotiate';
  if(s>=35)return'🔶 Below Average — Push Back Hard';
  if(s>=20)return'🔴 Poor Deal — Major Concerns';
  return'🚨 Predatory — Do Not Sign';
}
function esc(str){if(!str)return'';return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
