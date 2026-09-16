"use client";
import CreateTeamMember from './CreateTeamMember';
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, User, CurrencyInr, CreditCard, Briefcase, ListChecks, Users, Globe, HardDrives, Check, Plus, Trash, Lightning, ShieldCheck } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';
import { PROJECT_TYPES, PAYMENT_METHODS, COST_TYPES, DEFAULT_STAGE_TEMPLATES, DEFAULT_STAGE_TASKS, DEFAULT_REQUIREMENT_TEMPLATES } from '@/lib/founder_os_constants';

const STEPS = [
  { id: 1, title: 'Client', icon: User },
  { id: 2, title: 'Project', icon: Briefcase },
  { id: 3, title: 'Finance', icon: CurrencyInr },
  { id: 4, title: 'Payments', icon: CreditCard },
  { id: 5, title: 'Costs', icon: CurrencyInr },
  { id: 6, title: 'Team', icon: Users },
  { id: 7, title: 'Stages', icon: ListChecks },
  { id: 8, title: 'Tasks', icon: CheckCircle },
  { id: 9, title: 'Requirements', icon: HardDrives },
  { id: 10, title: 'Hosting', icon: Globe },
  { id: 11, title: 'Sales', icon: Briefcase },
  { id: 12, title: 'Review', icon: ShieldCheck }
];

export default function ProjectWizardModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null, // Can contain pre-filled lead or proposal data
  currency = '₹'
}) {
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Existing Clients & People & Leads from Database
  const [existingClients, setExistingClients] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  // Step 1: Client
  const [clientMode, setClientMode] = useState('existing'); // 'existing' | 'new'
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    industry: '',
    notes: ''
  });

  // Step 2: Project Details
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Business Website');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [projectStatus, setProjectStatus] = useState('Planning');

  // Step 3: Finance
  const [projectValue, setProjectValue] = useState('');
  const [hasAdvance, setHasAdvance] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceDate, setAdvanceDate] = useState(new Date().toISOString().substring(0, 10));
  const [advanceMethod, setAdvanceMethod] = useState('UPI');

  // Step 4: Payment Structure
  const [paymentStructure, setPaymentStructure] = useState('Advance + Final');
  const [finalAmount, setFinalAmount] = useState('');
  const [milestones, setMilestones] = useState([
    { name: 'Advance on Kickoff', amount: '', due_date: '' },
    { name: 'Design Sign-off', amount: '', due_date: '' },
    { name: 'Final Handover', amount: '', due_date: '' }
  ]);

  // Step 5: Planned Costs
  const [hasCosts, setHasCosts] = useState(false);
  const [plannedCosts, setPlannedCosts] = useState([
    { cost_type: 'Designer', description: 'UI/UX Design assets', expected_amount: '' }
  ]);

  // Step 6: Team
  const [selectedTeam, setSelectedTeam] = useState([]);

  // Step 7: Delivery Stages
  const [selectedStages, setSelectedStages] = useState([
    'Requirements',
    'Design',
    'Development',
    'Client Review',
    'QA',
    'Deployment'
  ]);
  const [customStageInput, setCustomStageInput] = useState('');

  // Step 8: Standard Tasks
  const [generateTasks, setGenerateTasks] = useState(true);

  // Step 9: Client Requirements
  const [selectedRequirements, setSelectedRequirements] = useState([
    'Logo (Vector/SVG/High-res PNG)',
    'Brand colors & style guide',
    'Website copy & page content',
    'Domain registrar access / DNS records'
  ]);
  const [customReqInput, setCustomReqInput] = useState('');

  // Step 10: Domain & Hosting
  const [domainManager, setDomainManager] = useState('Client');
  const [hostingManager, setHostingManager] = useState('InfronixWeb');
  const [hostingProvider, setHostingProvider] = useState('Vercel / Hostinger');
  const [hostingRenewalDate, setHostingRenewalDate] = useState('');
  const [hostingCost, setHostingCost] = useState('');
  const [hostingBilling, setHostingBilling] = useState('Billed to Client Annually');

  // Step 11: Sales Connection
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [linkedProposalId, setLinkedProposalId] = useState('');

  // Load Lookups on mount
  useEffect(() => {
    if (isOpen) {
      loadLookups();
      if (initialData) {
        applyInitialData(initialData);
      }
    }
  }, [isOpen, initialData]);

  async function loadLookups() {
    setLoadingLookups(true);
    try {
      const [clientsRes, peopleRes, leadsRes] = await Promise.all([
        fetch('/api/founder-os/clients'),
        fetch('/api/founder-os/people'),
        fetch('/api/founder-os/leads?status=ALL')
      ]);

      const [clientsData, peopleData, leadsData] = await Promise.all([
        clientsRes.json(),
        peopleRes.json(),
        leadsRes.json()
      ]);

      if (clientsData.success) setExistingClients(clientsData.clients || []);
      if (peopleData.success) setPeopleList((peopleData.people || []).filter(person => person.status === 'Active'));
      if (leadsData.success) setLeadsList(leadsData.leads || []);
    } catch (err) {
      console.error('Error loading lookups for wizard:', err);
    } finally {
      setLoadingLookups(false);
    }
  }

  function applyInitialData(data) {
    if (data.client) {
      setClientMode('existing');
      setSelectedClientId(String(data.client.id));
    } else if (data.lead) {
      setSelectedLeadId(String(data.lead.id));
      setProjectName(data.lead.company ? `${data.lead.company} Project` : `${data.lead.name}'s Project`);
      if (data.lead.estimated_value) setProjectValue(String(data.lead.estimated_value));
      if (data.lead.client_id) {
        setClientMode('existing');
        setSelectedClientId(String(data.lead.client_id));
      } else {
        setClientMode('new');
        setNewClient({
          name: data.lead.name || '',
          company: data.lead.company || '',
          phone: data.lead.phone || '',
          email: data.lead.email || '',
          industry: data.lead.industry || '',
          notes: data.lead.notes || ''
        });
      }
    } else if (data.proposal) {
      setLinkedProposalId(String(data.proposal.id));
      setProjectName(data.proposal.project_title || `${data.proposal.client_name} Project`);
      if (data.proposal.proposal_value) setProjectValue(String(data.proposal.proposal_value));
      if (data.proposal.client_id) {
        setClientMode('existing');
        setSelectedClientId(String(data.proposal.client_id));
      } else {
        setClientMode('new');
        setNewClient({
          name: data.proposal.client_name || '',
          company: '',
          phone: '',
          email: '',
          industry: '',
          notes: data.proposal.notes || ''
        });
      }
    }
  }

  // Calculated Finance Numbers
  const numValue = parseFloat(projectValue || 0);
  const numAdvance = hasAdvance ? parseFloat(advanceAmount || 0) : 0;
  const numOutstanding = Math.max(0, numValue - numAdvance);

  // Auto calculate final amount when advance changes
  useEffect(() => {
    if (paymentStructure === 'Advance + Final') {
      setFinalAmount(String(numOutstanding));
    }
  }, [projectValue, hasAdvance, advanceAmount, paymentStructure]);

  // Stage toggle helper
  function toggleStage(stage) {
    if (selectedStages.includes(stage)) {
      setSelectedStages(selectedStages.filter(s => s !== stage));
    } else {
      setSelectedStages([...selectedStages, stage]);
    }
  }

  function addCustomStage() {
    if (customStageInput.trim() && !selectedStages.includes(customStageInput.trim())) {
      setSelectedStages([...selectedStages, customStageInput.trim()]);
      setCustomStageInput('');
    }
  }

  // Requirement toggle helper
  function toggleRequirement(req) {
    if (selectedRequirements.includes(req)) {
      setSelectedRequirements(selectedRequirements.filter(r => r !== req));
    } else {
      setSelectedRequirements([...selectedRequirements, req]);
    }
  }

  function addCustomRequirement() {
    if (customReqInput.trim() && !selectedRequirements.includes(customReqInput.trim())) {
      setSelectedRequirements([...selectedRequirements, customReqInput.trim()]);
      setCustomReqInput('');
    }
  }

  // Team toggle helper
  function toggleTeamMember(person, defaultRole = 'Developer') {
    const exists = selectedTeam.some(t => t.person_id === person.id);
    if (exists) {
      setSelectedTeam(selectedTeam.filter(t => t.person_id !== person.id));
    } else {
      setSelectedTeam([...selectedTeam, {
        person_id: person.id,
        person_name: person.name,
        role: person.role || defaultRole
      }]);
    }
  }

  function updateTeamRole(personId, newRole) {
    setSelectedTeam(selectedTeam.map(t => t.person_id === personId ? { ...t, role: newRole } : t));
  }

  // Planned Cost helper
  function addPlannedCostRow() {
    setPlannedCosts([...plannedCosts, { cost_type: 'Freelancer', description: '', expected_amount: '' }]);
  }

  function updatePlannedCostRow(index, field, value) {
    const updated = [...plannedCosts];
    updated[index][field] = value;
    setPlannedCosts(updated);
  }

  function removePlannedCostRow(index) {
    setPlannedCosts(plannedCosts.filter((_, i) => i !== index));
  }

  // Milestone helper
  function addMilestoneRow() {
    setMilestones([...milestones, { name: `Milestone ${milestones.length + 1}`, amount: '', due_date: '' }]);
  }

  function updateMilestoneRow(index, field, value) {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  }

  function removeMilestoneRow(index) {
    setMilestones(milestones.filter((_, i) => i !== index));
  }

  // Step Validation before going Next
  function handleNext() {
    if (currentStep === 1) {
      if (clientMode === 'existing' && !selectedClientId) {
        showToast('Please select an existing client or choose Create New Client', 'warning');
        return;
      }
      if (clientMode === 'new' && !newClient.name.trim()) {
        showToast('Please enter the client contact name', 'warning');
        return;
      }
    } else if (currentStep === 2) {
      if (!projectName.trim()) {
        showToast('Please enter a project name', 'warning');
        return;
      }
    } else if (currentStep === 3) {
      if (hasAdvance && (!advanceAmount || parseFloat(advanceAmount) <= 0)) {
        showToast('Please enter the received advance amount', 'warning');
        return;
      }
      if (hasAdvance && parseFloat(advanceAmount) > numValue && numValue > 0) {
        showToast('Advance amount cannot exceed total project value', 'warning');
        return;
      }
    } else if (currentStep === 4) {
      if (paymentStructure === 'Milestones') {
        const totalMilestones = milestones.reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);
        if (numValue > 0 && Math.abs(totalMilestones - numValue) > 1) {
          showToast(`Total milestone amounts (${currency}${totalMilestones.toLocaleString('en-IN')}) must equal project value (${currency}${numValue.toLocaleString('en-IN')})`, 'warning');
          return;
        }
      }
    }

    setCurrentStep(prev => Math.min(12, prev + 1));
  }

  // Submit Wizard & Setup Everything
  async function handleFinalSubmit(isQuick = false) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        client_mode: clientMode,
        client_id: clientMode === 'existing' ? selectedClientId : null,
        new_client: clientMode === 'new' ? newClient : null,
        project_name: projectName,
        project_type: projectType,
        description,
        start_date: startDate,
        deadline: deadline || null,
        priority,
        status: projectStatus,
        project_value: numValue,
        has_advance: hasAdvance,
        advance_amount: numAdvance,
        advance_date: advanceDate,
        advance_method: advanceMethod,
        payment_structure: paymentStructure,
        final_amount: parseFloat(finalAmount || numOutstanding),
        milestones: paymentStructure === 'Milestones' ? milestones : [],
        has_costs: hasCosts,
        planned_costs: hasCosts ? plannedCosts : [],
        team_members: selectedTeam,
        stages: isQuick ? ['Requirements', 'Development', 'QA', 'Deployment'] : selectedStages,
        generate_tasks: isQuick ? true : generateTasks,
        client_requirements: isQuick ? ['Logo', 'Brand colors', 'Website copy'] : selectedRequirements,
        domain_manager: domainManager,
        hosting_manager: hostingManager,
        hosting_provider: hostingManager === 'InfronixWeb' ? hostingProvider : null,
        hosting_renewal_date: hostingRenewalDate || null,
        hosting_cost: hostingCost || 0,
        hosting_billing: hostingBilling || null,
        lead_id: selectedLeadId || null,
        proposal_id: linkedProposalId || null,
        is_quick_mode: isQuick
      };

      const res = await fetch('/api/founder-os/projects/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(isQuick ? 'Quick project created. Continue setup in Delivery.' : 'Project created & fully configured across all modules!', 'success');
        if (onSuccess) onSuccess(data.projectId);
        onClose();
      } else {
        showToast(data.error || 'Failed to setup project', 'error');
      }
    } catch (err) {
      console.error('Wizard submission error:', err);
      showToast('Network error during project setup', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const selectedClientObj = existingClients.find(c => String(c.id) === String(selectedClientId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase size={18} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-outfit">
                  {isQuickMode ? 'Quick Project Setup' : 'Smart Project Setup Wizard'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-100 text-violet-700">
                  {isQuickMode ? 'Quick Mode' : `Step ${currentStep} of 12`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Enter information once — all financial, delivery, team and task records link automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuickMode(!isQuickMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isQuickMode ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Quick Mode"
            >
              <Lightning size={14} weight="bold" />
              <span>{isQuickMode ? 'Full Wizard' : 'Quick Mode'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker (Full Wizard only) */}
        {!isQuickMode && (
          <div className="px-4 py-2 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center justify-between gap-1 min-w-[700px]">
              {STEPS.map((s) => {
                const isDone = currentStep > s.id;
                const isCurrent = currentStep === s.id;
                const StepIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isDone || isCurrent) setCurrentStep(s.id);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                        : isDone
                        ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isCurrent ? 'bg-white text-violet-700' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isDone ? <Check size={10} weight="bold" /> : s.id}
                    </span>
                    <span className="text-[11px] whitespace-nowrap">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white space-y-6">

          {/* QUICK MODE FORM */}
          {isQuickMode ? (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Quick Project Mode:</strong> Fill in the 4 essential fields. The project will be created immediately with standard delivery stages, initial setup progress set to 25%, allowing you to finish setup later.
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Who is this project for? *</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setClientMode('existing')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      clientMode === 'existing' ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Select Existing Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientMode('new')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      clientMode === 'new' ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Create New Client
                  </button>
                </div>

                {clientMode === 'existing' ? (
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    <option value="">-- Choose Client --</option>
                    {existingClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Client Contact Name *"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Project Name *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Apex Hospital Portal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Project Value ({currency}) *</label>
                  <input
                    type="number"
                    value={projectValue}
                    onChange={(e) => setProjectValue(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Expected Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* FULL STEP-BY-STEP WIZARD */
            <div>
              {/* STEP 1: CLIENT */}
              {currentStep === 1 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Who is this project for?</h4>
                    <p className="text-xs text-slate-500">Select an existing client or enter new client details.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setClientMode('existing')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        clientMode === 'existing'
                          ? 'bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <User size={22} weight="bold" className={clientMode === 'existing' ? 'text-violet-600' : 'text-slate-400'} />
                      <div className="font-bold text-xs text-slate-900 mt-2">Select Existing Client</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Reuse stored contact & company profile</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClientMode('new')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        clientMode === 'new'
                          ? 'bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Plus size={22} weight="bold" className={clientMode === 'new' ? 'text-violet-600' : 'text-slate-400'} />
                      <div className="font-bold text-xs text-slate-900 mt-2">Create New Client</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Quickly add a brand-new customer</div>
                    </button>
                  </div>

                  {clientMode === 'existing' ? (
                    <div className="space-y-3 pt-2">
                      <label className="block text-slate-700 font-bold text-xs">Select Client from Directory *</label>
                      <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      >
                        <option value="">-- Choose Existing Client ({existingClients.length} found) --</option>
                        {existingClients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.company ? `• ${c.company}` : ''} {c.phone ? `(${c.phone})` : ''}
                          </option>
                        ))}
                      </select>

                      {selectedClientObj && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fadeIn">
                          <div className="font-bold text-slate-900">{selectedClientObj.name}</div>
                          {selectedClientObj.company && <div className="text-slate-600">Company: {selectedClientObj.company}</div>}
                          {selectedClientObj.phone && <div className="text-slate-600">Phone: {selectedClientObj.phone}</div>}
                          {selectedClientObj.email && <div className="text-slate-600">Email: {selectedClientObj.email}</div>}
                          <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                            ✓ Auto-fetched contact & history. No duplicate typing required.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Contact Name *</label>
                          <input
                            type="text"
                            value={newClient.name}
                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                            placeholder="e.g. Dr. Rajesh Patel"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Company Name</label>
                          <input
                            type="text"
                            value={newClient.company}
                            onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                            placeholder="e.g. Apex Hospitals Pvt Ltd"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={newClient.phone}
                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Email Address</label>
                          <input
                            type="email"
                            value={newClient.email}
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                            placeholder="contact@apexhospital.com"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Industry</label>
                          <input
                            type="text"
                            value={newClient.industry}
                            onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                            placeholder="e.g. Healthcare / Tech / Retail"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">Client Notes</label>
                          <input
                            type="text"
                            value={newClient.notes}
                            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                            placeholder="Key client preferences..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: PROJECT DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Project Details</h4>
                    <p className="text-xs text-slate-500">Define the project scope, timeline, and delivery parameters.</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Project Name *</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Apex Hospital Modern 3D Web Portal"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">Project Type</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                      >
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">Initial Status</label>
                      <select
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                      >
                        <option value="Planning">Planning</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="Review">Review</option>
                        <option value="QA">QA</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">Expected Deadline</label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">Project Description / Technical Scope</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Key deliverables, tech stack requirements, or architecture notes..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: FINANCE */}
              {currentStep === 3 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Let's set up the finances for this project</h4>
                    <p className="text-xs text-slate-500">Record contract valuation and any upfront payments.</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">What is the total project contract value? *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{currency}</span>
                      <input
                        type="number"
                        value={projectValue}
                        onChange={(e) => setProjectValue(e.target.value)}
                        placeholder="25000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                      />
                    </div>
                  </div>

                  {numValue > 0 && (
                    <div className="space-y-3 pt-2">
                      <label className="block text-slate-700 font-bold text-xs">Has the client paid anything yet?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => { setHasAdvance(false); setAdvanceAmount(''); }}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            !hasAdvance ? 'bg-violet-50 text-violet-700 border-violet-300 ring-2 ring-violet-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          No Payment Yet
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasAdvance(true)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            hasAdvance ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Yes (Advance Received)
                        </button>
                      </div>

                      {hasAdvance && (
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3 animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-emerald-900 font-bold text-xs mb-1">Amount Received *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-bold">{currency}</span>
                                <input
                                  type="number"
                                  value={advanceAmount}
                                  onChange={(e) => setAdvanceAmount(e.target.value)}
                                  placeholder="10000"
                                  className="w-full bg-white border border-emerald-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-emerald-900 font-bold text-xs mb-1">Payment Date</label>
                              <input
                                type="date"
                                value={advanceDate}
                                onChange={(e) => setAdvanceDate(e.target.value)}
                                className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>
                            <div>
                              <label className="block text-emerald-900 font-bold text-xs mb-1">Payment Method</label>
                              <select
                                value={advanceMethod}
                                onChange={(e) => setAdvanceMethod(e.target.value)}
                                className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              >
                                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                            ✓ Automatically creates linked Revenue transaction in Finance. No manual duplicate entry needed.
                          </div>
                        </div>
                      )}

                      {/* Live Calculation Display */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">Project Value</span>
                          <span className="font-bold text-slate-900">{currency}{numValue.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-600 uppercase font-sans font-bold block mb-0.5">Cash Received</span>
                          <span className="font-bold text-emerald-700">{currency}{numAdvance.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-600 uppercase font-sans font-bold block mb-0.5">Outstanding</span>
                          <span className="font-bold text-amber-700">{currency}{numOutstanding.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: PAYMENT STRUCTURE */}
              {currentStep === 4 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">How will this project be paid?</h4>
                    <p className="text-xs text-slate-500">Configure schedule milestones for automated tracking.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Full Payment', 'Advance + Final', 'Milestones', 'Custom'].map(struct => (
                      <button
                        key={struct}
                        type="button"
                        onClick={() => setPaymentStructure(struct)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentStructure === struct
                            ? 'bg-violet-50 text-violet-700 border-violet-300 ring-2 ring-violet-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {struct}
                      </button>
                    ))}
                  </div>

                  {paymentStructure === 'Advance + Final' && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-slate-800">Payment Breakdown:</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-500 block mb-1">Advance Milestone ({hasAdvance ? 'Received ✓' : 'Pending'})</span>
                          <div className="text-sm font-bold text-slate-900 font-mono">{currency}{numAdvance.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-500 block mb-1">Final Settlement (Pending)</span>
                          <div className="text-sm font-bold text-slate-900 font-mono">{currency}{parseFloat(finalAmount || numOutstanding).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Automatically generates payment schedule milestones for delivery handover.
                      </div>
                    </div>
                  )}

                  {paymentStructure === 'Milestones' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Custom Milestones:</span>
                        <button
                          type="button"
                          onClick={addMilestoneRow}
                          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                        >
                          <Plus size={14} weight="bold" /> Add Milestone
                        </button>
                      </div>

                      <div className="space-y-2">
                        {milestones.map((m, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => updateMilestoneRow(idx, 'name', e.target.value)}
                              placeholder="Milestone Title"
                              className="sm:col-span-5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                            />
                            <input
                              type="number"
                              value={m.amount}
                              onChange={(e) => updateMilestoneRow(idx, 'amount', e.target.value)}
                              placeholder={`Amount (${currency})`}
                              className="sm:col-span-3 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono font-bold"
                            />
                            <input
                              type="date"
                              value={m.due_date}
                              onChange={(e) => updateMilestoneRow(idx, 'due_date', e.target.value)}
                              className="sm:col-span-3 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => removeMilestoneRow(idx)}
                              className="sm:col-span-1 text-slate-400 hover:text-rose-600 p-1 flex items-center justify-center"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-slate-500">
                          Total Milestone Sum: <strong className="text-slate-900 font-mono">{currency}{milestones.reduce((s, m) => s + parseFloat(m.amount || 0), 0).toLocaleString('en-IN')}</strong>
                        </span>
                        <span className="text-slate-500">
                          Target Project Value: <strong className="text-slate-900 font-mono">{currency}{numValue.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: PROJECT COSTS */}
              {currentStep === 5 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Do you expect any costs for this project?</h4>
                    <p className="text-xs text-slate-500">Planned costs stay separate until actually spent, keeping cash accounting clean.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHasCosts(false)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        !hasCosts ? 'bg-violet-50 text-violet-700 border-violet-300 ring-2 ring-violet-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      No Planned Costs
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasCosts(true)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        hasCosts ? 'bg-violet-50 text-violet-700 border-violet-300 ring-2 ring-violet-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Yes, Expect Costs
                    </button>
                  </div>

                  {hasCosts && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Budgeted Cost Items (Marked as Planned):</span>
                        <button
                          type="button"
                          onClick={addPlannedCostRow}
                          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                        >
                          <Plus size={14} weight="bold" /> Add Cost
                        </button>
                      </div>

                      <div className="space-y-2">
                        {plannedCosts.map((cost, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                            <select
                              value={cost.cost_type}
                              onChange={(e) => updatePlannedCostRow(idx, 'cost_type', e.target.value)}
                              className="sm:col-span-4 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900 font-medium"
                            >
                              {COST_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                            </select>
                            <input
                              type="text"
                              value={cost.description}
                              onChange={(e) => updatePlannedCostRow(idx, 'description', e.target.value)}
                              placeholder="Description (e.g. 3D Model Artist)"
                              className="sm:col-span-5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                            />
                            <input
                              type="number"
                              value={cost.expected_amount}
                              onChange={(e) => updatePlannedCostRow(idx, 'expected_amount', e.target.value)}
                              placeholder={`Expected ${currency}`}
                              className="sm:col-span-2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900 font-mono font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => removePlannedCostRow(idx)}
                              className="sm:col-span-1 text-slate-400 hover:text-rose-600 p-1 flex items-center justify-center"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                        <strong>Important:</strong> These are recorded initially as <em>Expected / Planned</em>. When money is actually spent, you can convert them into an actual Expense with one click.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: TEAM */}
              {currentStep === 6 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Who will work on this project?</h4>
                    <p className="text-xs text-slate-500">Select actual team members from your People module.</p>
                  </div>

                  <CreateTeamMember onCreated={person => {
                    setPeopleList(previous => [...previous, person]);
                    toggleTeamMember(person);
                  }} />
                  {peopleList.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <Users size={32} className="mx-auto text-slate-400" />
                      <div className="text-xs font-bold text-slate-800">No team members available in People module.</div>
                      <p className="text-[11px] text-slate-500">You can skip team selection for now and assign staff later.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {peopleList.map(person => {
                        const isAssigned = selectedTeam.some(t => t.person_id === person.id);
                        const assignedObj = selectedTeam.find(t => t.person_id === person.id);
                        return (
                          <div
                            key={person.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                              isAssigned ? 'bg-violet-50/70 border-violet-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              onClick={() => toggleTeamMember(person)}
                              className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                                isAssigned ? 'bg-violet-600 text-white' : 'border border-slate-300 bg-white text-transparent'
                              }`}>
                                <Check size={14} weight="bold" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{person.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{person.role} • {person.employment_type}</div>
                              </div>
                            </div>

                            {isAssigned && (
                              <select
                                value={assignedObj?.role || person.role}
                                onChange={(e) => updateTeamRole(person.id, e.target.value)}
                                className="bg-white border border-violet-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none"
                              >
                                <option value="Project Manager">Project Manager</option>
                                <option value="Developer">Developer</option>
                                <option value="Designer">Designer</option>
                                <option value="QA">QA</option>
                                <option value="Content">Content</option>
                                <option value="Other">Other</option>
                              </select>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: DELIVERY WORKFLOW STAGES */}
              {currentStep === 7 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">What stages are required for this project?</h4>
                    <p className="text-xs text-slate-500">Select template stages or add custom milestones to track delivery.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {DEFAULT_STAGE_TEMPLATES.map(stage => {
                      const isSelected = selectedStages.includes(stage);
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => toggleStage(stage)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-violet-50 text-violet-800 border-violet-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs truncate">{stage}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-violet-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} weight="bold" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={customStageInput}
                      onChange={(e) => setCustomStageInput(e.target.value)}
                      placeholder="Add custom stage name..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={addCustomStage}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Selected stages ({selectedStages.length}): {selectedStages.join(' → ')}
                  </div>
                </div>
              )}

              {/* STEP 8: TASK GENERATION */}
              {currentStep === 8 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Generate Standard Tasks for selected stages?</h4>
                    <p className="text-xs text-slate-500">Automatically creates deliverable tasks with status "Todo".</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGenerateTasks(true)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        generateTasks
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle size={22} weight="bold" className={generateTasks ? 'text-emerald-600' : 'text-slate-400'} />
                      <div className="font-bold text-xs mt-2">Yes, Generate Tasks</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Creates standard tasks for each selected stage</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGenerateTasks(false)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        !generateTasks
                          ? 'bg-violet-50 text-violet-900 border-violet-300 ring-2 ring-violet-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ListChecks size={22} weight="bold" className={!generateTasks ? 'text-violet-600' : 'text-slate-400'} />
                      <div className="font-bold text-xs mt-2">Start with Empty Tasks</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">I will manually create custom tasks later</div>
                    </button>
                  </div>

                  {generateTasks && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="font-bold text-slate-800">Preview Tasks to be Created (Initial Status: Todo):</div>
                      <div className="max-h-40 overflow-y-auto space-y-1 pr-2 no-scrollbar">
                        {selectedStages.map(stage => {
                          const tasks = DEFAULT_STAGE_TASKS[stage] || [];
                          if (tasks.length === 0) return null;
                          return (
                            <div key={stage} className="text-[11px] text-slate-600">
                              <strong className="text-slate-800">{stage}:</strong> {tasks.map(t => t.title).join(', ')}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 9: CLIENT REQUIREMENTS */}
              {currentStep === 9 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">What do we need from the client?</h4>
                    <p className="text-xs text-slate-500">Track pending assets, brand guidelines, and credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEFAULT_REQUIREMENT_TEMPLATES.map(req => {
                      const isSelected = selectedRequirements.includes(req);
                      return (
                        <div
                          key={req}
                          onClick={() => toggleRequirement(req)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected ? 'bg-violet-50 text-violet-900 border-violet-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs truncate">{req}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-violet-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} weight="bold" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={customReqInput}
                      onChange={(e) => setCustomReqInput(e.target.value)}
                      placeholder="Add custom client requirement..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={addCustomRequirement}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 10: DOMAIN & HOSTING */}
              {currentStep === 10 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Domain & Hosting Management</h4>
                    <p className="text-xs text-slate-500">Record infrastructure responsibilities (zero passwords stored).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1.5">Who manages the domain?</label>
                      <div className="space-y-1.5">
                        {['Client', 'InfronixWeb', 'Not decided'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setDomainManager(opt)}
                            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              domainManager === opt ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold text-xs mb-1.5">Who manages hosting?</label>
                      <div className="space-y-1.5">
                        {['Client', 'InfronixWeb', 'Not decided'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setHostingManager(opt)}
                            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              hostingManager === opt ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {hostingManager === 'InfronixWeb' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                      <div className="text-xs font-bold text-slate-800">InfronixWeb Managed Hosting Details:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 text-xs mb-1">Hosting Provider</label>
                          <input
                            type="text"
                            value={hostingProvider}
                            onChange={(e) => setHostingProvider(e.target.value)}
                            placeholder="e.g. Vercel Pro / Hostinger VPS"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-xs mb-1">Renewal Date</label>
                          <input
                            type="date"
                            value={hostingRenewalDate}
                            onChange={(e) => setHostingRenewalDate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 text-xs mb-1">Annual Hosting Cost ({currency})</label>
                          <input
                            type="number"
                            value={hostingCost}
                            onChange={(e) => setHostingCost(e.target.value)}
                            placeholder="4500"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-xs mb-1">Billing Responsibility</label>
                          <input
                            type="text"
                            value={hostingBilling}
                            onChange={(e) => setHostingBilling(e.target.value)}
                            placeholder="e.g. Billed to Client Annually"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 11: SALES CONNECTION */}
              {currentStep === 11 && (
                <div className="space-y-4 max-w-xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Did this project come from an existing Lead?</h4>
                    <p className="text-xs text-slate-500">Connects sales records and automatically sets Lead status to Won.</p>
                  </div>

                  <div className="space-y-3">
                    <select
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                    >
                      <option value="">-- No Lead / Direct Client Project --</option>
                      {leadsList.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name} {l.company ? `• ${l.company}` : ''} (Status: {l.status} • ₹{parseFloat(l.estimated_value || 0).toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>

                    {selectedLeadId && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="font-bold">✓ Connected Sales Pipeline:</div>
                        <div>Lead status will automatically transition to <strong>Won</strong>.</div>
                        <div className="text-[11px] text-emerald-700">Audit trail: Lead → Client → Project → Finance linked in database.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 12: FINAL REVIEW */}
              {currentStep === 12 && (
                <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
                  <div className="text-center pb-2">
                    <h4 className="text-base font-bold text-slate-900 font-outfit">Final Review & Confirmation</h4>
                    <p className="text-xs text-slate-500">Everything is configured. Review below and create in one safe transaction.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Project Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">PROJECT & CLIENT</div>
                      <div className="font-bold text-slate-900 text-sm">{projectName}</div>
                      <div className="text-slate-600">
                        Client: <strong className="text-slate-800">{clientMode === 'existing' ? selectedClientObj?.name : newClient.name}</strong>
                      </div>
                      <div className="text-slate-600">Type: {projectType} • Priority: {priority}</div>
                      {deadline && <div className="text-slate-600">Deadline: {new Date(deadline).toLocaleDateString()}</div>}
                    </div>

                    {/* Finance Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">FINANCIALS</div>
                      <div className="font-bold text-slate-900 text-sm font-mono">{currency}{numValue.toLocaleString('en-IN')}</div>
                      <div className="text-emerald-700 font-medium">Cash Received: {currency}{numAdvance.toLocaleString('en-IN')}</div>
                      <div className="text-amber-700 font-medium">Outstanding: {currency}{numOutstanding.toLocaleString('en-IN')}</div>
                      <div className="text-slate-500 text-[11px]">Payment Structure: {paymentStructure}</div>
                    </div>

                    {/* Delivery & Tasks Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">DELIVERY & WORKFLOW</div>
                      <div className="font-bold text-slate-900">{selectedStages.length} Stages Configured</div>
                      <div className="text-slate-600">Tasks: {generateTasks ? 'Standard Todo Tasks Generated' : 'Manual Setup'}</div>
                      <div className="text-slate-600">Requirements: {selectedRequirements.length} Pending Items</div>
                    </div>

                    {/* Team & Infrastructure Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">TEAM & INFRASTRUCTURE</div>
                      <div className="font-bold text-slate-900">{selectedTeam.length} Assigned Members</div>
                      <div className="text-slate-600">Domain: {domainManager}</div>
                      <div className="text-slate-600">Hosting: {hostingManager}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-900 text-xs flex items-center gap-2">
                    <ShieldCheck size={20} className="text-violet-600 shrink-0" weight="bold" />
                    <span>
                      <strong>Safe Transaction:</strong> All records will be created simultaneously inside a single database transaction. If any part fails, nothing is corrupted.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div>
            {!isQuickMode && currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
              >
                <ArrowLeft size={14} weight="bold" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            {isQuickMode ? (
              <button
                type="button"
                disabled={submitting || !projectName.trim() || (clientMode === 'existing' && !selectedClientId) || (clientMode === 'new' && !newClient.name.trim())}
                onClick={() => handleFinalSubmit(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Quick Project'}
              </button>
            ) : currentStep < 12 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-violet-600/20 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle size={16} weight="bold" />
                <span>{submitting ? 'Setting Up...' : 'Create Project & Setup Everything'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
