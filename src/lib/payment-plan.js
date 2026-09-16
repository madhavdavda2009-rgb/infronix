export function money(value, label = 'Amount') {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0 || number > 9999999999.99) {
    throw new Error(`${label} must be a valid non-negative amount`);
  }
  return Math.round(number * 100);
}

// Allocate received money once, in integer paise, across the agreed installments.
export function buildPaymentPlan(body) {
  const value = money(body.project_value, 'Project value');
  const advance = body.has_advance ? money(body.advance_amount, 'Advance') : 0;
  if (body.has_advance && advance <= 0) throw new Error('Received advance must be positive');
  if (advance > value) throw new Error('Advance cannot exceed project value');
  let rows;
  if (body.payment_structure === 'Milestones') {
    if (!Array.isArray(body.milestones) || !body.milestones.length) throw new Error('Add payment milestones');
    rows = body.milestones.map(row => {
      if (typeof row.name !== 'string' || !row.name.trim()) throw new Error('Each milestone needs a name');
      const amount = money(row.amount, 'Milestone amount');
      if (!amount) throw new Error('Milestone amounts must be positive');
      return { name: row.name.trim(), amount, due_date: row.due_date || null };
    });
    if (rows.reduce((sum, row) => sum + row.amount, 0) !== value) throw new Error('Milestones must total the project value');
  } else if (body.payment_structure === 'Advance + Final') {
    rows = [];
    if (advance) rows.push({ name: 'Advance Payment', amount: advance, due_date: body.advance_date || body.start_date || null });
    if (value > advance) rows.push({ name: 'Final Settlement', amount: value - advance, due_date: body.deadline || null });
  } else {
    rows = value ? [{ name: 'Full Project Payment', amount: value, due_date: body.deadline || null }] : [];
  }
  let remaining = advance;
  const result = [];
  for (const row of rows) {
    const paid = Math.min(remaining, row.amount);
    remaining -= paid;
    if (paid) result.push({ ...row, amount: paid / 100, received: true, name: paid < row.amount ? `${row.name} (received portion)` : row.name });
    if (paid < row.amount) result.push({ ...row, amount: (row.amount - paid) / 100, received: false, name: paid ? `${row.name} (remaining)` : row.name });
  }
  return result;
}
