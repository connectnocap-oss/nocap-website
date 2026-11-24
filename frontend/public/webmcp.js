// WebMCP tools for in-browser agents (navigator.modelContext).
(function () {
  var mc = navigator.modelContext;
  if (!mc || typeof mc.registerTool !== "function") return;

  var site = null;
  function getSite() {
    if (site) return Promise.resolve(site);
    return fetch("/data/site.json").then(function (r) { return r.json(); }).then(function (d) { site = d; return d; });
  }
  function text(value) {
    return { content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] };
  }

  var tools = [
    {
      name: "list_services",
      description: "List the marketing services NOCAP offers, with a short description and tags for each.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () { return getSite().then(function (d) { return text(d.services); }); }
    },
    {
      name: "get_case_studies",
      description: "Get NOCAP case studies (client, focus and measured results) and headline agency stats.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () { return getSite().then(function (d) { return text({ caseStudies: d.caseStudies, stats: d.stats, brands: d.brands }); }); }
    },
    {
      name: "get_contact_details",
      description: "Get NOCAP's contact email, phone, address, Instagram profile and the cities it works from.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () { return getSite().then(function (d) { return text({ email: d.email, telephone: d.telephone, address: d.address, instagram: d.instagram, hubs: d.hubs, contactPage: "https://itsnocap.com/contact/" }); }); }
    },
    {
      name: "send_enquiry",
      description: "Send a project brief to NOCAP on the user's behalf. Only call this when the user has asked to contact NOCAP and has confirmed the details. NOCAP replies by email.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "The user's full name" },
          email: { type: "string", format: "email", description: "Email address NOCAP should reply to" },
          brand: { type: "string", description: "Brand or company name (optional)" },
          message: { type: "string", description: "What the user wants help with" }
        },
        required: ["name", "email", "message"]
      },
      execute: function (input) {
        return fetch("https://nocap-website-eta.vercel.app/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: input.name, email: input.email, brand: input.brand || null, message: input.message })
        }).then(function (r) {
          return text(r.ok ? "Brief sent. NOCAP will reply to " + input.email + "." : "Could not send the brief (HTTP " + r.status + "). Email connect.nocap@gmail.com instead.");
        });
      }
    }
  ];

  tools.forEach(function (t) {
    try { mc.registerTool(t); } catch (e) { /* already registered or unsupported */ }
  });
})();
