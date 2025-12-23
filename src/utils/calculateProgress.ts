export function calculateProgress(data: any): number {
  if (!data?.document?.debtor) return 0;

  const fields = ["wings", "gsp_citizen", "wings_doc"];
  const total = fields.length;
  let filled = 0;

  fields.forEach((field) => {
    if (data?.document?.debtor[field]) filled++;
  });

  return Math.round((filled / total) * 100);
}
