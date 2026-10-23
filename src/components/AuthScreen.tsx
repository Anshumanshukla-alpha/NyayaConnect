import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, Scale, ShieldCheck, UserPlus } from 'lucide-react';
import { api } from '../api';

interface Props { onAuthenticated: () => Promise<void>; }

export const AuthScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const [mode,setMode]=useState<'login'|'register'>('login');
  const [role,setRole]=useState<'CLIENT'|'LAWYER'>('CLIENT');
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [barCouncilNumber,setBarCouncilNumber]=useState('');
  const [showPassword,setShowPassword]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setError('');try{if(mode==='login'){await api.login(email,password);}else{await api.register(name,email,password,role,role==='LAWYER'?barCouncilNumber:undefined);await api.login(email,password);}await onAuthenticated();}catch(err:any){setError(err?.message??'Unable to complete authentication.');}finally{setLoading(false);}};
  return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
    <div className="w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/10 bg-white text-slate-900 shadow-2xl">
      <section className="hidden lg:flex flex-col justify-between bg-slate-950 p-10 text-white">
        <div><div className="flex items-center gap-3"><div className="h-11 w-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center"><Scale/></div><span className="text-2xl font-black">NyayaConnect</span></div>
        <h1 className="mt-16 text-5xl font-black tracking-tight leading-[1.05]">Your legal problem.<br/><span className="text-amber-400">One connected workspace.</span></h1>
        <p className="mt-6 max-w-md text-slate-300 leading-7">AI-assisted intake, verified-lawyer discovery, secure case documents and human legal consultation in one place.</p></div>
        <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/5 border border-white/10 p-4"><ShieldCheck className="text-emerald-400"/><b className="block mt-3">Privacy-first</b><span className="text-slate-400">Server-side access controls</span></div><div className="rounded-2xl bg-white/5 border border-white/10 p-4"><LockKeyhole className="text-amber-400"/><b className="block mt-3">AI with guardrails</b><span className="text-slate-400">Human verification required</span></div></div>
      </section>
      <section className="p-6 sm:p-10">
        <div className="lg:hidden flex items-center gap-2 font-black text-xl mb-8"><div className="h-9 w-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center"><Scale className="h-5 w-5"/></div>NyayaConnect</div>
        <div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-widest text-amber-600">Secure access</div><h2 className="text-3xl font-black mt-2">{mode==='login'?'Welcome back':'Create your account'}</h2></div><div className="rounded-full bg-slate-100 p-2"><UserPlus className="h-5 w-5 text-slate-500"/></div></div>
        {error && <div className="mt-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-3 text-sm flex gap-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5"/>{error}</div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode==='register' && <label className="block text-sm font-semibold">Full name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="Your full name"/></label>}
          <label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="you@example.com"/></label>
          <label className="block text-sm font-semibold">Password<div className="relative"><input required minLength={12} type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 pr-11" placeholder="Minimum 12 characters"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-4 text-slate-400">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></label>
          {mode==='register' && role==='LAWYER' && <label className="block text-sm font-semibold">Bar Council registration number<input required value={barCouncilNumber} onChange={e=>setBarCouncilNumber(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="State/Bar registration number"/></label>}
          {mode==='register' && <div><div className="text-sm font-semibold mb-2">Account type</div><div className="grid grid-cols-2 gap-2">{(['CLIENT','LAWYER'] as const).map(x=><button type="button" key={x} onClick={()=>setRole(x)} className={`rounded-xl border p-3 text-sm font-bold ${role===x?'border-slate-900 bg-slate-950 text-white':'border-slate-200'}`}>{x==='CLIENT'?'Client':'Lawyer'}</button>)}</div></div>}
          <button disabled={loading} className="w-full rounded-xl bg-slate-950 text-white py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50">{loading?'Please wait…':mode==='login'?'Sign in':'Create account'}<ArrowRight className="h-4 w-4 text-amber-400"/></button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">{mode==='login'?"Don't have an account?":"Already registered?"} <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}} className="font-bold text-slate-900 underline">{mode==='login'?'Create one':'Sign in'}</button></div>
        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">For security, use your own account credentials. Demo credentials should only be used in a private evaluation environment.</div>
      </section>
    </div>
  </div>;
};
