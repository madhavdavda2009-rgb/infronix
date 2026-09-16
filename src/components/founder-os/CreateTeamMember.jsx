'use client';
import { useState } from 'react';

export default function CreateTeamMember({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({ name: '', role: '', email: '', phone: '', employment_type: 'Employee' });
  async function save() {
    if (busy) return;
    setError('');
    if (!fields.name.trim() || !fields.role.trim()) { setError('Name and role are required'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/founder-os/people', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields)
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to add team member');
      onCreated(data.person);
      setOpen(false);
      setFields({ name: '', role: '', email: '', phone: '', employment_type: 'Employee' });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="text-xs font-bold text-violet-700 py-2">+ Add Team Member</button>;
  return <div className="rounded-xl border border-slate-200 p-3 space-y-3 bg-slate-50 text-xs">
    <p className="font-bold text-slate-900">Create a team member</p>
    {['name', 'role', 'email', 'phone'].map(field => <label key={field} className="block capitalize text-slate-700">
      {field}{['name', 'role'].includes(field) ? ' *' : ''}
      <input type={field === 'email' ? 'email' : 'text'} value={fields[field]} onChange={event => setFields({ ...fields, [field]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900" />
    </label>)}
    <label className="block text-slate-700">Employment type
      <select value={fields.employment_type} onChange={event => setFields({ ...fields, employment_type: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2">
        {['Founder', 'Employee', 'Freelancer', 'Contractor', 'Intern'].map(type => <option key={type}>{type}</option>)}
      </select>
    </label>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="flex gap-3"><button type="button" disabled={busy} onClick={save} className="rounded-lg bg-violet-600 px-3 py-2 font-bold text-white">{busy ? 'Saving…' : 'Save Member'}</button><button type="button" disabled={busy} onClick={() => setOpen(false)}>Cancel</button></div>
  </div>;
}
