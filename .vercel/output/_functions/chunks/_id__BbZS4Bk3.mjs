import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, ap as defineScriptVars, aW as maybeRenderHead, a5 as addAttribute } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { createClient } from '@supabase/supabase-js';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data: session } = await supabase.from("chat_sessions").select("*").eq("id", id).single();
  if (!session) return Astro2.redirect("/admin");
  const { data: messages } = await supabase.from("chat_messages").select("*").eq("session_id", id).order("created_at", { ascending: true });
  if (session.status === "waiting") {
    await supabase.from("chat_sessions").update({ status: "active" }).eq("id", id);
    session.status = "active";
  }
  const ssrMessageIds = (messages || []).map((m) => m.id);
  const lastMsgTime = messages && messages.length > 0 ? messages[messages.length - 1].created_at : (/* @__PURE__ */ new Date()).toISOString();
  const supabaseUrl = process.env.SUPABASE_URL || "https://jmeqighdvacggmwtbxfo.supabase.co";
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZXFpZ2hkdmFjZ2dtd3RieGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTY4NDYsImV4cCI6MjA4ODI3Mjg0Nn0.xsrP9O3vVZb4JK-pgb8zE2fMBFKX8mV1gljmPCO8F70";
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  (async () => {
    var mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
    var supabase = mod.createClient(supabaseUrl, supabaseKey);
    var messagesDiv = document.getElementById('admin-messages');
    var form = document.getElementById('admin-chat-form');
    var input = document.getElementById('admin-chat-input');
    var closeBtn = document.getElementById('close-session-btn');
    var renderedIds = new Set(ssrMessageIds);
    var lastCheck = lastMsgTime;

    function scrollToBottom() { if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight; }
    scrollToBottom();

    function appendMessage(text, sender, timestamp) {
      if (!messagesDiv) return;
      var ph = document.getElementById('no-messages-placeholder');
      if (ph) ph.remove();
      var div = document.createElement('div');
      div.className = 'flex ' + (sender === 'admin' ? 'justify-end' : 'justify-start');
      var time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = '<div class="max-w-[70%]"><div class="rounded-2xl px-4 py-3 text-sm leading-relaxed ' +
        (sender === 'admin' ? 'bg-primary text-white rounded-tr-md' : 'bg-zinc-100 text-zinc-700 rounded-tl-md') +
        '">' + text.replace(/\\n/g, '<br>') + '</div><span class="text-[10px] text-zinc-400 mt-1 block ' +
        (sender === 'admin' ? 'text-right pr-1' : 'pl-1') + '">' +
        (sender === 'admin' ? 'You' : 'Visitor') + ' \\u2022 ' + time + '</span></div>';
      messagesDiv.appendChild(div);
      scrollToBottom();
    }

    if (form && input) {
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.dispatchEvent(new Event('submit')); } });
      input.addEventListener('input', function() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        input.style.height = 'auto';
        input.focus();
        appendMessage(text, 'admin', new Date().toISOString());
        try {
          var result = await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'admin', message: text }).select('id, created_at').single();
          if (result.data) { renderedIds.add(result.data.id); if (result.data.created_at > lastCheck) lastCheck = result.data.created_at; }
        } catch (err) { console.warn('Send failed:', err); }
      });
    }

    if (sessionStatus !== 'closed') {
      setInterval(async function() {
        try {
          var result = await supabase.from('chat_messages').select('id, sender, message, created_at').eq('session_id', sessionId).gt('created_at', lastCheck).order('created_at', { ascending: true });
          if (result.data) {
            for (var i = 0; i < result.data.length; i++) {
              var msg = result.data[i];
              lastCheck = msg.created_at;
              if (renderedIds.has(msg.id)) continue;
              renderedIds.add(msg.id);
              if (msg.sender === 'visitor') {
                appendMessage(msg.message, msg.sender, msg.created_at);
                if (msg.message === '(Visitor left the chat)') {
                  var statusEl = document.getElementById('session-status');
                  if (statusEl) { statusEl.textContent = 'closed'; statusEl.className = 'font-medium text-zinc-400'; }
                  if (input) input.disabled = true;
                }
              }
            }
          }
        } catch (err) { console.warn('Poll error:', err); }
      }, 2000);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', async function() {
        if (!confirm('Close this chat session?')) return;
        await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', sessionId);
        await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'admin', message: 'This chat session has been closed. Thank you for contacting us!' });
        window.location.reload();
      });
    }
  })();
})();</script>`], ["", " <script>(function(){", `
  (async () => {
    var mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
    var supabase = mod.createClient(supabaseUrl, supabaseKey);
    var messagesDiv = document.getElementById('admin-messages');
    var form = document.getElementById('admin-chat-form');
    var input = document.getElementById('admin-chat-input');
    var closeBtn = document.getElementById('close-session-btn');
    var renderedIds = new Set(ssrMessageIds);
    var lastCheck = lastMsgTime;

    function scrollToBottom() { if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight; }
    scrollToBottom();

    function appendMessage(text, sender, timestamp) {
      if (!messagesDiv) return;
      var ph = document.getElementById('no-messages-placeholder');
      if (ph) ph.remove();
      var div = document.createElement('div');
      div.className = 'flex ' + (sender === 'admin' ? 'justify-end' : 'justify-start');
      var time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = '<div class="max-w-[70%]"><div class="rounded-2xl px-4 py-3 text-sm leading-relaxed ' +
        (sender === 'admin' ? 'bg-primary text-white rounded-tr-md' : 'bg-zinc-100 text-zinc-700 rounded-tl-md') +
        '">' + text.replace(/\\\\n/g, '<br>') + '</div><span class="text-[10px] text-zinc-400 mt-1 block ' +
        (sender === 'admin' ? 'text-right pr-1' : 'pl-1') + '">' +
        (sender === 'admin' ? 'You' : 'Visitor') + ' \\\\u2022 ' + time + '</span></div>';
      messagesDiv.appendChild(div);
      scrollToBottom();
    }

    if (form && input) {
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.dispatchEvent(new Event('submit')); } });
      input.addEventListener('input', function() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        input.style.height = 'auto';
        input.focus();
        appendMessage(text, 'admin', new Date().toISOString());
        try {
          var result = await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'admin', message: text }).select('id, created_at').single();
          if (result.data) { renderedIds.add(result.data.id); if (result.data.created_at > lastCheck) lastCheck = result.data.created_at; }
        } catch (err) { console.warn('Send failed:', err); }
      });
    }

    if (sessionStatus !== 'closed') {
      setInterval(async function() {
        try {
          var result = await supabase.from('chat_messages').select('id, sender, message, created_at').eq('session_id', sessionId).gt('created_at', lastCheck).order('created_at', { ascending: true });
          if (result.data) {
            for (var i = 0; i < result.data.length; i++) {
              var msg = result.data[i];
              lastCheck = msg.created_at;
              if (renderedIds.has(msg.id)) continue;
              renderedIds.add(msg.id);
              if (msg.sender === 'visitor') {
                appendMessage(msg.message, msg.sender, msg.created_at);
                if (msg.message === '(Visitor left the chat)') {
                  var statusEl = document.getElementById('session-status');
                  if (statusEl) { statusEl.textContent = 'closed'; statusEl.className = 'font-medium text-zinc-400'; }
                  if (input) input.disabled = true;
                }
              }
            }
          }
        } catch (err) { console.warn('Poll error:', err); }
      }, 2000);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', async function() {
        if (!confirm('Close this chat session?')) return;
        await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', sessionId);
        await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'admin', message: 'This chat session has been closed. Thank you for contacting us!' });
        window.location.reload();
      });
    }
  })();
})();</script>`])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Chat — ${session.visitor_name || "Visitor"}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex items-center justify-between mb-6"> <div class="flex items-center gap-4"> <a href="/admin" class="p-2 rounded-lg hover:bg-zinc-100 transition-colors"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg> </a> <div> <h1 class="text-lg font-semibold text-zinc-900">${session.visitor_name || "Anonymous Visitor"}</h1> <p class="text-sm text-zinc-500"> ${session.visitor_email || "No email provided"} •
<span id="session-status"${addAttribute(`font-medium ${session.status === "active" ? "text-green-600" : "text-zinc-400"}`, "class")}>${session.status}</span> </p> </div> </div> ${session.status !== "closed" && renderTemplate`<button id="close-session-btn" class="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
Close Chat
</button>`} </div> <div class="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col" style="height: calc(100vh - 260px);"> <div id="admin-messages" class="flex-1 overflow-y-auto px-6 py-4 space-y-4"> ${(!messages || messages.length === 0) && renderTemplate`<p id="no-messages-placeholder" class="text-center text-zinc-400 text-sm py-8">No messages yet.</p>`} ${messages?.map((msg) => renderTemplate`<div${addAttribute(`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`, "class")}> <div${addAttribute(`max-w-[70%]`, "class")}> <div${addAttribute(`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "admin" ? "bg-primary text-white rounded-tr-md" : "bg-zinc-100 text-zinc-700 rounded-tl-md"}`, "class")}> ${msg.message} </div> <span${addAttribute(`text-[10px] text-zinc-400 mt-1 block ${msg.sender === "admin" ? "text-right pr-1" : "pl-1"}`, "class")}> ${msg.sender === "admin" ? "You" : session.visitor_name || "Visitor"} •
${new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </span> </div> </div>`)} </div> ${session.status !== "closed" ? renderTemplate`<div class="px-6 py-4 border-t border-zinc-100"> <form id="admin-chat-form" class="flex items-center gap-3"> <textarea id="admin-chat-input" placeholder="Type your reply..." autocomplete="off" rows="1" class="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none overflow-hidden" style="max-height: 120px;"></textarea> <button type="submit" class="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-light transition-colors shrink-0">Send</button> </form> </div>` : renderTemplate`<div class="px-6 py-4 border-t border-zinc-100 text-center"> <p class="text-sm text-zinc-400">This chat session has been closed.</p> </div>`} </div> ` }), defineScriptVars({ sessionId: id, supabaseUrl, supabaseKey: supabaseAnonKey, sessionStatus: session.status, ssrMessageIds, lastMsgTime }));
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/chat/[id].astro", void 0);
const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/chat/[id].astro";
const $$url = "/admin/chat/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
