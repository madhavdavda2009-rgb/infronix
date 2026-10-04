// Display-only wording for the original profile; admin records remain editable.
const originalBios = new Map([
  ['Founder & Lead Engineer at InfronixWeb. Direct access, massive impact.', 'Founder at InfronixWeb. Work directly with me on your website and business goals.'],
  ['Leading engineering and technical architecture at InfronixWeb. Focused on building high-performance web applications, AI automation pipelines, and scalable digital solutions for growing businesses.', 'Helping businesses create useful websites, reach customers and simplify everyday work.'],
  ['We intentionally keep our operations direct. You work closely with the expert engineering and designing your product.', 'Work directly with the person planning, designing and building your website.'],
]);

export function publicRole(role) {
  return role === 'Founder & Lead Engineer' ? 'Founder' : role;
}

export function publicBio(bio) {
  return originalBios.get(bio) || bio;
}
