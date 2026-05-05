import pptxgen from "pptxgenjs";
import { projects } from "../data/projectData";

const fmt = (n) => {
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n}`;
};

const COST_RISK = 0.2;
const TIME_RISK = 30;
const atRisk = (p) => p.cost_drift_pct > COST_RISK || p.timeline_drift_days > TIME_RISK;

const C = {
  pri: "5E0A1F", priLight: "8B1A3D", gold: "C4A35A", goldLight: "D4B896",
  bg: "F5F2ED", white: "FFFFFF", text: "2D2D2D", sub: "666666",
  red: "C62828", green: "2E7D32", orange: "EF6C00", light: "F8F5F0",
  line: "E0D8D0", card: "FAFAFA"
};

export const generateExecutivePPT = () => {
  return new Promise((resolve, reject) => {
    try {
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";
      pres.author = "L'Oréal Transformation Office";
      pres.company = "L'Oréal";
      pres.subject = "Monthly Business Review";

      const total = projects.length;
      const totalValue = projects.reduce((s,p) => s + p.le_yearly_impact, 0);
      const totalPlanned = projects.reduce((s,p) => s + p.planned_total_costs, 0);
      const totalLE = projects.reduce((s,p) => s + p.le_total_costs, 0);
      const riskProjects = projects.filter(atRisk);
      const costRiskList = projects.filter(p => p.cost_drift_pct > COST_RISK);
      const timeRiskList = projects.filter(p => p.timeline_drift_days > TIME_RISK);
      const top5 = [...projects].sort((a,b) => b.le_yearly_impact - a.le_yearly_impact).slice(0,5);
      const topRisk = [...riskProjects].sort((a,b) => b.cost_drift_pct - a.cost_drift_pct).slice(0,5);

      const byDomain = {};
      projects.forEach(p => {
        if (!byDomain[p.domain]) byDomain[p.domain] = {projects:[], value:0, risk:0, cost:0};
        byDomain[p.domain].projects.push(p);
        byDomain[p.domain].value += p.le_yearly_impact;
        byDomain[p.domain].cost += p.le_total_costs;
        if (atRisk(p)) byDomain[p.domain].risk++;
      });
      const domainsSorted = Object.entries(byDomain).sort((a,b) => b[1].value - a[1].value);

      const byPhase = {};
      projects.forEach(p => {
        if (!byPhase[p.project_phase]) byPhase[p.project_phase] = {count:0, risk:0};
        byPhase[p.project_phase].count++;
        if (atRisk(p)) byPhase[p.project_phase].risk++;
      });

      const topIntervention = [...riskProjects].sort((a,b) =>
        (b.cost_drift_pct * b.le_yearly_impact) - (a.cost_drift_pct * a.le_yearly_impact)
      ).slice(0,5);

      const today = new Date().toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});

      // Helper: slide master elements
      const addSlideChrome = (slide, title, subtitle) => {
        slide.background = { color: C.white };
        // Top bar
        slide.addShape(pres.ShapeType.rect, {x:0, y:0, w:"100%", h:0.06, fill:{color:C.gold}});
        // Header band
        slide.addShape(pres.ShapeType.rect, {x:0, y:0.06, w:"100%", h:0.9, fill:{color:C.pri}});
        slide.addText(title, {x:0.5, y:0.15, w:7, h:0.7, color:C.white, fontSize:22, bold:true, fontFace:"Calibri"});
        if (subtitle) {
          slide.addText(subtitle, {x:0.5, y:0.6, w:7, h:0.3, color:C.goldLight, fontSize:10, fontFace:"Calibri"});
        }
        slide.addText("L'ORÉAL", {x:8, y:0.2, w:1.8, h:0.25, color:C.gold, fontSize:11, bold:true, align:"right", fontFace:"Calibri"});
        slide.addText("TRANSFORMATION OFFICE", {x:7.5, y:0.45, w:2.3, h:0.2, color:C.goldLight, fontSize:7, align:"right", fontFace:"Calibri", letterSpacing:2});
        // Footer
        slide.addShape(pres.ShapeType.rect, {x:0, y:5.2, w:"100%", h:0.35, fill:{color:C.light}});
        slide.addText("CONFIDENTIAL — L'Oréal Transformation Office North America", {x:0.5, y:5.22, w:6, h:0.3, color:C.sub, fontSize:7, fontFace:"Calibri"});
        slide.addText(today, {x:7, y:5.22, w:2.8, h:0.3, color:C.sub, fontSize:7, align:"right", fontFace:"Calibri"});
      };

      const addKPI = (slide, x, y, label, value, color, w=2.6) => {
        slide.addShape(pres.ShapeType.rect, {x, y, w, h:1.2, fill:{color:C.white}, shadow:{type:"outer", blur:4, offset:2, color:"00000010"}, rectRadius:0.08});
        slide.addShape(pres.ShapeType.rect, {x, y, w:0.06, h:1.2, fill:{color}, rectRadius:0.08});
        slide.addText(label, {x:x+0.2, y:y+0.1, w:w-0.3, h:0.35, fontSize:9, color:C.sub, fontFace:"Calibri"});
        slide.addText(value, {x:x+0.2, y:y+0.45, w:w-0.3, h:0.6, fontSize:26, bold:true, color, fontFace:"Calibri"});
      };

      const tblOpts = (x, y, w, colW) => ({
        x, y, w, colW,
        border: {pt:0.5, color:C.line},
        fontSize: 9,
        fontFace: "Calibri",
        valign: "middle",
        rowH: 0.35,
        autoPage: false,
      });

      const hdrCell = (text) => ({text, options:{bold:true, fill:C.pri, color:C.white, fontSize:9}});
      const statusCell = (p) => atRisk(p)
        ? {text:"⚠ AT RISK", options:{color:C.red, bold:true, fontSize:8}}
        : {text:"✓ ON TRACK", options:{color:C.green, bold:true, fontSize:8}};

      // ===== SLIDE 1: TITLE =====
      const s0 = pres.addSlide();
      s0.background = {color: C.pri};
      s0.addShape(pres.ShapeType.rect, {x:0, y:0, w:"100%", h:0.08, fill:{color:C.gold}});
      s0.addText("TRANSFORMATION OFFICE", {x:0.8, y:1.0, w:8, h:0.5, color:C.gold, fontSize:14, fontFace:"Calibri", bold:true, letterSpacing:4});
      s0.addText("Monthly Business Review", {x:0.8, y:1.5, w:8, h:0.8, color:C.white, fontSize:36, fontFace:"Calibri", bold:true});
      s0.addText("Portfolio Performance & Risk Summary", {x:0.8, y:2.3, w:8, h:0.5, color:C.goldLight, fontSize:16, fontFace:"Calibri"});
      s0.addShape(pres.ShapeType.rect, {x:0.8, y:3.0, w:2, h:0.04, fill:{color:C.gold}});
      s0.addText(today, {x:0.8, y:3.3, w:4, h:0.4, color:C.goldLight, fontSize:12, fontFace:"Calibri"});
      s0.addText("L'ORÉAL NORTH AMERICA", {x:0.8, y:3.7, w:4, h:0.3, color:C.white, fontSize:10, fontFace:"Calibri", bold:true});
      s0.addShape(pres.ShapeType.rect, {x:0, y:5.2, w:"100%", h:0.35, fill:{color:"4A0818"}});
      s0.addText("CONFIDENTIAL", {x:0.8, y:5.22, w:3, h:0.3, color:C.gold, fontSize:8, fontFace:"Calibri", bold:true});

      // ===== SLIDE 2: PORTFOLIO OVERVIEW =====
      const s1 = pres.addSlide();
      addSlideChrome(s1, "Portfolio Overview", "Executive Summary — Key Performance Indicators");
      addKPI(s1, 0.4, 1.3, "ACTIVE PROJECTS", `${total}`, C.pri);
      addKPI(s1, 3.3, 1.3, "PORTFOLIO VALUE (YEARLY)", fmt(totalValue), C.pri);
      addKPI(s1, 6.2, 1.3, "TOTAL INVESTMENT (LE)", fmt(totalLE), C.gold);
      addKPI(s1, 0.4, 2.8, "PROJECTS AT RISK", `${riskProjects.length} of ${total}`, C.red);
      addKPI(s1, 3.3, 2.8, "COST OVERRUN", fmt(totalLE - totalPlanned), C.orange);
      addKPI(s1, 6.2, 2.8, "ON TRACK", `${total - riskProjects.length} projects`, C.green);
      s1.addText(
        `The transformation portfolio comprises ${total} active projects generating ${fmt(totalValue)} in yearly impact. ` +
        `${riskProjects.length} projects (${((riskProjects.length/total)*100).toFixed(0)}%) are flagged for cost or timeline risk, ` +
        `representing a combined LE overrun of ${fmt(totalLE - totalPlanned)}. Immediate governance focus is recommended.`,
        {x:0.4, y:4.3, w:9.2, h:0.7, fontSize:10, color:C.sub, fontFace:"Calibri", lineSpacingMultiple:1.3}
      );

      // ===== SLIDE 3: VALUE DRIVERS =====
      const s2 = pres.addSlide();
      addSlideChrome(s2, "Value Drivers", "Top 5 Projects by Yearly Portfolio Value Contribution");
      const vRows = [[hdrCell("#"), hdrCell("Project"), hdrCell("Domain"), hdrCell("Phase"), hdrCell("Yearly Impact"), hdrCell("Cost Drift"), hdrCell("Status")]];
      top5.forEach((p,i) => vRows.push([
        `${i+1}`, p.project_name, p.domain, p.project_phase,
        fmt(p.le_yearly_impact),
        {text:`${(p.cost_drift_pct*100).toFixed(0)}%`, options:{color: p.cost_drift_pct > COST_RISK ? C.red : C.green, bold:true}},
        statusCell(p)
      ]));
      s2.addTable(vRows, tblOpts(0.4, 1.3, 9.2, [0.4, 2.8, 1.3, 1.0, 1.3, 1.0, 1.2]));
      const top5val = top5.reduce((s,p) => s+p.le_yearly_impact, 0);
      const top5risk = top5.filter(atRisk).length;
      s2.addText(
        `These 5 projects drive ${fmt(top5val)} (${((top5val/totalValue)*100).toFixed(0)}% of portfolio value). ` +
        `${top5risk} are currently at risk — protecting these value drivers must be a top priority.`,
        {x:0.4, y:4.2, w:9.2, h:0.7, fontSize:10, color:C.sub, fontFace:"Calibri", lineSpacingMultiple:1.3}
      );

      // ===== SLIDE 4: RISK OVERVIEW =====
      const s3 = pres.addSlide();
      addSlideChrome(s3, "Risk Overview", "Cost & Timeline Risk Analysis");
      addKPI(s3, 0.4, 1.3, "COST RISK (>20% DRIFT)", `${costRiskList.length} projects`, C.red, 4.2);
      addKPI(s3, 5.4, 1.3, "TIMELINE RISK (>30 DAYS)", `${timeRiskList.length} projects`, C.orange, 4.2);
      s3.addText("Top Risk Projects", {x:0.4, y:2.8, w:4, h:0.35, fontSize:12, bold:true, color:C.pri, fontFace:"Calibri"});
      const rRows = [[hdrCell("Project"), hdrCell("Domain"), hdrCell("Planned"), hdrCell("LE Cost"), hdrCell("Cost Drift"), hdrCell("Timeline"), hdrCell("Status")]];
      topRisk.forEach(p => rRows.push([
        p.project_name, p.domain, fmt(p.planned_total_costs), fmt(p.le_total_costs),
        {text:`${(p.cost_drift_pct*100).toFixed(0)}%`, options:{color:C.red, bold:true}},
        {text:`${p.timeline_drift_days}d`, options:{color: p.timeline_drift_days > TIME_RISK ? C.red : C.green}},
        statusCell(p)
      ]));
      s3.addTable(rRows, tblOpts(0.4, 3.15, 9.2, [2.4, 1.1, 1.0, 1.0, 1.0, 0.9, 1.0]));

      // ===== SLIDE 5: PHASE DISTRIBUTION =====
      const s4 = pres.addSlide();
      addSlideChrome(s4, "Phase Distribution", "Project Lifecycle Stage Breakdown & Risk by Phase");
      const phases = Object.entries(byPhase);
      phases.forEach(([phase, d], i) => {
        const x = 0.4 + (i * 2.3);
        addKPI(s4, x, 1.3, phase.toUpperCase(), `${d.count} projects`, C.pri, 2.0);
        if (d.risk > 0) {
          s4.addText(`${d.risk} at risk`, {x:x+0.2, y:2.1, w:1.6, h:0.25, fontSize:8, color:C.red, fontFace:"Calibri", bold:true});
        }
      });
      const phaseInsight = phases.sort((a,b) => b[1].risk - a[1].risk);
      s4.addText(
        `${phaseInsight[0][0]} phase has the highest risk concentration with ${phaseInsight[0][1].risk} project(s) at risk. ` +
        `Projects should be closely reviewed before transitioning between phases to prevent risk escalation.`,
        {x:0.4, y:3.5, w:9.2, h:0.7, fontSize:10, color:C.sub, fontFace:"Calibri", lineSpacingMultiple:1.3}
      );

      // ===== SLIDE 6: DOMAIN INSIGHTS =====
      const s5 = pres.addSlide();
      addSlideChrome(s5, "Domain Insights", "Value Contribution & Risk Concentration by Domain");
      const dRows = [[hdrCell("Domain"), hdrCell("Projects"), hdrCell("Portfolio Value"), hdrCell("LE Investment"), hdrCell("At Risk"), hdrCell("Risk %")]];
      domainsSorted.forEach(([dom, d]) => {
        const riskPct = d.projects.length > 0 ? ((d.risk/d.projects.length)*100).toFixed(0) : 0;
        dRows.push([
          dom, `${d.projects.length}`, fmt(d.value), fmt(d.cost),
          {text:`${d.risk}`, options:{color: d.risk > 0 ? C.red : C.green, bold:true}},
          {text:`${riskPct}%`, options:{color: riskPct > 40 ? C.red : riskPct > 0 ? C.orange : C.green}}
        ]);
      });
      s5.addTable(dRows, tblOpts(0.4, 1.3, 9.2, [2.2, 1.0, 1.5, 1.5, 1.0, 1.0]));
      const topDom = domainsSorted[0];
      const riskDom = [...domainsSorted].sort((a,b) => b[1].risk - a[1].risk)[0];
      s5.addText(
        `${topDom[0]} leads with ${fmt(topDom[1].value)} in value (${((topDom[1].value/totalValue)*100).toFixed(0)}% of portfolio). ` +
        `${riskDom[0]} has the highest risk concentration with ${riskDom[1].risk} project(s) requiring governance attention.`,
        {x:0.4, y:4.3, w:9.2, h:0.6, fontSize:10, color:C.sub, fontFace:"Calibri", lineSpacingMultiple:1.3}
      );

      // ===== SLIDE 7: FULL PROJECT PORTFOLIO =====
      const s6 = pres.addSlide();
      addSlideChrome(s6, "Full Portfolio View", "All Active Transformation Projects — Sorted by Value");
      const allRows = [[hdrCell("Project"), hdrCell("Domain"), hdrCell("Phase"), hdrCell("Planned"), hdrCell("LE"), hdrCell("Impact"), hdrCell("Drift%"), hdrCell("Days"), hdrCell("Status")]];
      [...projects].sort((a,b) => b.le_yearly_impact - a.le_yearly_impact).forEach(p => {
        allRows.push([
          {text:p.project_name, options:{fontSize:7}},
          {text:p.domain, options:{fontSize:7}},
          {text:p.project_phase, options:{fontSize:7}},
          {text:fmt(p.planned_total_costs), options:{fontSize:7}},
          {text:fmt(p.le_total_costs), options:{fontSize:7}},
          {text:fmt(p.le_yearly_impact), options:{fontSize:7}},
          {text:`${(p.cost_drift_pct*100).toFixed(0)}%`, options:{fontSize:7, color: p.cost_drift_pct > COST_RISK ? C.red : C.green, bold:true}},
          {text:`${p.timeline_drift_days}`, options:{fontSize:7, color: p.timeline_drift_days > TIME_RISK ? C.red : C.green}},
          atRisk(p) ? {text:"RISK", options:{fontSize:7, color:C.red, bold:true}} : {text:"OK", options:{fontSize:7, color:C.green, bold:true}}
        ]);
      });
      s6.addTable(allRows, {...tblOpts(0.2, 1.15, 9.6, [2.0, 1.0, 0.85, 0.85, 0.85, 0.85, 0.7, 0.6, 0.6]), rowH:0.22});

      // ===== SLIDE 8: INTERVENTION =====
      const s7 = pres.addSlide();
      addSlideChrome(s7, "Intervention Recommendations", "Projects Requiring Immediate Executive Attention");
      const iRows = [[hdrCell("Priority"), hdrCell("Project"), hdrCell("Domain"), hdrCell("Value at Risk"), hdrCell("Cost Drift"), hdrCell("Timeline"), hdrCell("Primary Issue")]];
      topIntervention.forEach((p,i) => {
        const reasons = [];
        if (p.cost_drift_pct > COST_RISK) reasons.push(`${(p.cost_drift_pct*100).toFixed(0)}% cost overrun`);
        if (p.timeline_drift_days > TIME_RISK) reasons.push(`${p.timeline_drift_days}d delay`);
        iRows.push([
          {text:`P${i+1}`, options:{bold:true, color:C.red}},
          p.project_name, p.domain, fmt(p.le_yearly_impact),
          {text:`${(p.cost_drift_pct*100).toFixed(0)}%`, options:{color:C.red, bold:true}},
          {text:`${p.timeline_drift_days}d`, options:{color: p.timeline_drift_days > TIME_RISK ? C.red : C.green}},
          reasons.join(", ")
        ]);
      });
      s7.addTable(iRows, tblOpts(0.4, 1.3, 9.2, [0.6, 2.2, 1.2, 1.2, 1.0, 0.9, 2.1]));
      s7.addText("RECOMMENDED ACTIONS", {x:0.4, y:3.8, w:3, h:0.3, fontSize:10, bold:true, color:C.pri, fontFace:"Calibri"});
      s7.addText(
        "1. Schedule deep-dive reviews for P1 and P2 priority projects within 48 hours.\n" +
        "2. Initiate formal cost re-baseline for projects exceeding 30% drift threshold.\n" +
        "3. Assign dedicated recovery leads for timeline-critical projects.\n" +
        "4. Escalate resource conflicts blocking project delivery to SteerCo.",
        {x:0.4, y:4.1, w:9.2, h:0.9, fontSize:9, color:C.text, fontFace:"Calibri", lineSpacingMultiple:1.4}
      );

      // ===== SLIDE 9: CLOSING =====
      const s8 = pres.addSlide();
      s8.background = {color: C.pri};
      s8.addShape(pres.ShapeType.rect, {x:0, y:0, w:"100%", h:0.08, fill:{color:C.gold}});
      s8.addText("Thank You", {x:0.8, y:1.5, w:8, h:1, color:C.white, fontSize:40, bold:true, fontFace:"Calibri"});
      s8.addShape(pres.ShapeType.rect, {x:0.8, y:2.6, w:2, h:0.04, fill:{color:C.gold}});
      s8.addText("L'Oréal Transformation Office — North America", {x:0.8, y:2.9, w:8, h:0.4, color:C.goldLight, fontSize:14, fontFace:"Calibri"});
      s8.addText(`Generated on ${today}`, {x:0.8, y:3.4, w:8, h:0.3, color:C.goldLight, fontSize:10, fontFace:"Calibri"});
      s8.addShape(pres.ShapeType.rect, {x:0, y:5.2, w:"100%", h:0.35, fill:{color:"4A0818"}});

      pres.write("blob").then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LOreal_MBR_Deck_${new Date().toISOString().slice(0,10)}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }).catch(reject);
    } catch (e) { reject(e); }
  });
};
