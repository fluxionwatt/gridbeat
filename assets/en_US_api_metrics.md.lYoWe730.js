import{_ as n,c as a,o as e,ah as t}from"./chunks/framework.DGOuNAW6.js";const u=JSON.parse('{"title":"Metrics","description":"","frontmatter":{},"headers":[],"relativePath":"en_US/api/metrics.md","filePath":"en_US/api/metrics.md"}'),p={name:"en_US/api/metrics.md"};function o(r,s,l,i,c,d){return e(),a("div",null,[...s[0]||(s[0]=[t(`<h1 id="metrics" tabindex="-1">Metrics <a class="header-anchor" href="#metrics" aria-label="Permalink to “Metrics”">​</a></h1><p>This API provides <a href="https://prometheus.io/" target="_blank" rel="noreferrer">Prometheus</a> compatible metrics data, and is provided by the <a href="./../configuration/north-apps/monitor/overview.html">Monitor plugin</a>.</p><h2 id="get-metrics" tabindex="-1">Get Metrics <a class="header-anchor" href="#get-metrics" aria-label="Permalink to “Get Metrics”">​</a></h2><p><em>GET</em> /api/v2/metrics</p><h3 id="request-headers" tabindex="-1">Request Headers <a class="header-anchor" href="#request-headers" aria-label="Permalink to “Request Headers”">​</a></h3><p><strong>Authorization</strong> Bearer &lt;token&gt;</p><h3 id="request-params" tabindex="-1">Request Params <a class="header-anchor" href="#request-params" aria-label="Permalink to “Request Params”">​</a></h3><p><strong>category</strong> optional, one of <code>global</code>, <code>driver</code> and <code>app</code><strong>node</strong> optional, filter with node name, only meaningful when <code>category=driver</code> or <code>category=app</code></p><h3 id="response-status" tabindex="-1">Response Status <a class="header-anchor" href="#response-status" aria-label="Permalink to “Response Status”">​</a></h3><ul><li>200 OK</li><li>400 Bad request</li><li>500 Internal server error</li></ul><h3 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-label="Permalink to “Response”">​</a></h3><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># HELP core_dumped Whether there is any core dump</span></span>
<span class="line"><span># TYPE core_dumped gauge</span></span>
<span class="line"><span>core_dumped 0</span></span>
<span class="line"><span># HELP uptime_seconds Uptime in seconds</span></span>
<span class="line"><span># TYPE uptime_seconds counter</span></span>
<span class="line"><span>uptime_seconds 314</span></span>
<span class="line"><span># HELP north_nodes_total Number of north nodes</span></span>
<span class="line"><span># TYPE north_nodes_total gauge</span></span>
<span class="line"><span>north_nodes_total 1</span></span>
<span class="line"><span># HELP north_running_nodes_total Number of north nodes in running state</span></span>
<span class="line"><span># TYPE north_running_nodes_total gauge</span></span>
<span class="line"><span>north_running_nodes_total 1</span></span>
<span class="line"><span># HELP north_disconnected_nodes_total Number of north nodes disconnected</span></span>
<span class="line"><span># TYPE north_disconnected_nodes_total gauge</span></span>
<span class="line"><span>north_disconnected_nodes_total 1</span></span>
<span class="line"><span># HELP south_nodes_total Number of south nodes</span></span>
<span class="line"><span># TYPE south_nodes_total gauge</span></span>
<span class="line"><span>south_nodes_total 1</span></span>
<span class="line"><span># HELP south_running_nodes_total Number of south nodes in running state</span></span>
<span class="line"><span># TYPE south_running_nodes_total gauge</span></span>
<span class="line"><span>south_running_nodes_total 0</span></span>
<span class="line"><span># HELP south_disconnected_nodes_total Number of south nodes disconnected</span></span>
<span class="line"><span># TYPE south_disconnected_nodes_total gauge</span></span>
<span class="line"><span>south_disconnected_nodes_total 1</span></span>
<span class="line"><span># HELP send_msgs_total Total number of messages sent</span></span>
<span class="line"><span># TYPE send_msgs_total counter</span></span>
<span class="line"><span>send_msgs_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP send_msg_errors_total Total number of errors sending messages</span></span>
<span class="line"><span># TYPE send_msg_errors_total counter</span></span>
<span class="line"><span>send_msg_errors_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP recv_msgs_total Total number of messages received</span></span>
<span class="line"><span># TYPE recv_msgs_total counter</span></span>
<span class="line"><span>recv_msgs_total{node=&quot;data-stream-processing&quot;} 0</span></span>
<span class="line"><span># HELP last_rtt_ms Last request round trip time in milliseconds</span></span>
<span class="line"><span># TYPE last_rtt_ms gauge</span></span>
<span class="line"><span>last_rtt_ms{node=&quot;modbus&quot;} 9999</span></span>
<span class="line"><span># HELP send_bytes Total number of bytes sent</span></span>
<span class="line"><span># TYPE send_bytes gauge</span></span>
<span class="line"><span>send_bytes{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP recv_bytes Total number of bytes received</span></span>
<span class="line"><span># TYPE recv_bytes gauge</span></span>
<span class="line"><span>recv_bytes{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP tag_reads_total Total number of tag reads including errors</span></span>
<span class="line"><span># TYPE tag_reads_total counter</span></span>
<span class="line"><span>tag_reads_total{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP tag_read_errors_total Total number of tag read errors</span></span>
<span class="line"><span># TYPE tag_read_errors_total counter</span></span>
<span class="line"><span>tag_read_errors_total{node=&quot;modbus&quot;} 0</span></span>
<span class="line"><span># HELP group_tags_total Total number of tags in the group</span></span>
<span class="line"><span># TYPE group_tags_total gauge</span></span>
<span class="line"><span>group_tags_total{node=&quot;modbus&quot;,group=&quot;grp&quot;} 1</span></span>
<span class="line"><span># HELP group_last_send_msgs Number of messages sent on last group timer invocation</span></span>
<span class="line"><span># TYPE group_last_send_msgs gauge</span></span>
<span class="line"><span>group_last_send_msgs{node=&quot;modbus&quot;,group=&quot;grp&quot;} 0</span></span>
<span class="line"><span># HELP group_last_timer_ms Time in milliseconds consumed on last group timer invocation</span></span>
<span class="line"><span># TYPE group_last_timer_ms gauge</span></span>
<span class="line"><span>group_last_timer_ms{node=&quot;modbus&quot;,group=&quot;grp&quot;} 0</span></span></code></pre></div>`,12)])])}const g=n(p,[["render",o]]);export{u as __pageData,g as default};
