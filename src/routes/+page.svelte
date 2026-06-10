<script lang="ts">
    import { onMount } from "svelte";
    import { fly, fade } from "svelte/transition";

    let activeSkillTab = $state("Backend & Systems");
    let visibleSections = $state<Set<string>>(new Set());
    let selectedSnippet = $state<{ name: string; lang: string; code: string } | null>(null);

    const skillTabs = [
        "Backend & Systems",
        "Frontend & Web",
        "Scripting & Game Dev",
        "DevOps & Cloud",
        "Security & Networking",
        "Databases & Data"
    ];

    const snippets: Record<string, { lang: string; code: string }> = {
        "C#": { lang: "csharp", code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        var numbers = new int[] { 1, 2, 3, 4, 5 };
        int sum = 0;
        foreach (var n in numbers) sum += n;
        Console.WriteLine($"Sum: {sum}");
    }
}` },
        "C++": { lang: "cpp", code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {5, 3, 1, 4, 2};
    std::sort(v.begin(), v.end());
    for (int x : v)
        std::cout << x << " ";
    return 0;
}` },
        ".NET": { lang: "csharp", code: `  ASP.NET Core Minimal API
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/users/{id}", (int id) => new { Id = id, Name = "zyRoWn" });

app.Run();` },
        "ASP.NET Core": { lang: "csharp", code: `[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
    [HttpGet("{id}")]
    public IActionResult GetUser(int id) {
        return Ok(new { Id = id, Name = "zyRoWn" });
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] UserDto dto) {
        return CreatedAtAction(nameof(GetUser), new { id = 1 }, dto);
    }
}` },
        "Entity Framework": { lang: "csharp", code: `public class AppDbContext : DbContext {
    public DbSet<User> Users => Set<User>();

    protected override void OnConfiguring(DbContextOptionsBuilder opts)
        => opts.UseSqlite("Data Source=app.db");
}

var users = await db.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .ToListAsync();` },
        "Python": { lang: "python", code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([5, 3, 1, 4, 2]))` },
        "FastAPI": { lang: "python", code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int

@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}

@app.post("/users")
def create_user(user: User):
    return {"created": user}` },
        "Django": { lang: "python", code: `from django.db import models
from django.http import JsonResponse

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

def get_posts(request):
    posts = list(Post.objects.values())
    return JsonResponse(posts, safe=False)` },
        "Flask": { lang: "python", code: `from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({"message": "Hello from Flask"})

@app.route("/echo", methods=["POST"])
def echo():
    data = request.json
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)` },
        "Go": { lang: "go", code: `package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Go!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}` },
        "Rust": { lang: "rust", code: `fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    for i in 0..10 {
        println!("fib({}) = {}", i, fibonacci(i));
    }
}` },
        "Node.js": { lang: "javascript", code: `const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Node.js!' }));
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});` },
        "Express.js": { lang: "javascript", code: `import express from 'express';

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'zyRoWn' }]);
});

app.post('/users', (req, res) => {
    const { name } = req.body;
    res.status(201).json({ id: Date.now(), name });
});

app.listen(3000);` },
        "NestJS": { lang: "typescript", code: `@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}` },
        "Lua": { lang: "lua", code: `local function greet(name)
    return "Hello, " .. name .. "!"
end

local players = {"zyRoWn", "Player2", "Player3"}
for i, p in ipairs(players) do
    print(i .. ": " .. greet(p))
end` },
        "GLua (Garry\'s Mod)": { lang: "lua", code: `-- Custom HUD element
hook.Add("HUDPaint", "CustomHealth", function()
    local ply = LocalPlayer()
    if not IsValid(ply) then return end

    local hp = ply:Health()
    draw.RoundedBox(6, 20, ScrH() - 60, 200, 40, Color(20, 20, 20, 180))
    draw.SimpleText("HP: " .. hp, "DermaLarge", 30, ScrH() - 50, Color(255, 80, 80))
end)` },
        "GLua": { lang: "lua", code: `-- Serverside admin command
concommand.Add("give_weapon", function(ply, cmd, args)
    if not ply:IsAdmin() then
        ply:ChatPrint("Access denied.")
        return
    end
    local wep = args[1]
    if wep then ply:Give(wep) end
end)` },
        "HTML5": { lang: "html", code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>zyRoWn</title>
</head>
<body>
    <header>
        <h1>zyRoWn</h1>
        <nav>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
        </nav>
    </header>
</body>
</html>` },
        "CSS3": { lang: "css", code: `.card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    border-color: rgba(168, 85, 247, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}` },
        "Tailwind CSS": { lang: "html", code: `<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-all duration-300 group">
    <div class="flex items-center gap-3 mb-4">
        <span class="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></span>
        <h3 class="text-zinc-100 font-semibold">zyRoWn</h3>
    </div>
    <p class="text-zinc-400 text-sm leading-relaxed">
        Full-Stack Developer & CTF Player
    </p>
</div>` },
        "JavaScript": { lang: "javascript", code: `async function fetchUser(id) {
    try {
        const res = await fetch(\`/api/users/\${id}\`);
        if (!res.ok) throw new Error('Not found');
        const user = await res.json();
        return user;
    } catch (err) {
        console.error(err);
    }
}

fetchUser(1).then(u => console.log(u?.name));` },
"TypeScript": {
    lang: "typescript",
    code: `interface User {
    id: number;
    name: string;
    role: 'admin' | 'user';
}

async function getUser(id: number): Promise<User | null> {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) return null;
    return res.json() as Promise<User>;
}

fetchUser(1).then(u => console.log(u?.name));`
},

"Svelte": {
    lang: "svelte",
    code: `<\\script>
    let count = 0;
    let doubled = count * 2;
<\\/script>

<button on:click={() => count++}>
    Clicked {count} times
</button>

<p>Doubled: {doubled}</p>`
},
        "SvelteKit": { lang: "typescript", code: `  src/routes/api/users/+server.ts
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
    const id = url.searchParams.get('id');
    return json({ id, name: 'zyRoWn' });
};

  src/routes/+page.server.ts
export const load = async ({ fetch }) => {
    const res = await fetch('/api/users?id=1');
    const user = await res.json();
    return { user };
};` },
        "CI/CD (GitHub Actions)": { lang: "yaml", code: `name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4` },
"Terraform": {
    lang: "hcl",
    code: `provider "aws" {
    region = "eu-west-1"
}

resource "aws_instance" "web" {
    ami           = "ami-0c55b159cbfafe1f0"
    instance_type = "t2.micro"

    tags = {
        Name = "zyrown-server"
    }
}

output "ip" {
    value = aws_instance.web.public_ip
}`
},
"Ansible": {
    lang: "yaml",
    code: `---
- name: Setup web server
  hosts: all
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes`
},
"Web Exploitation": {
    lang: "python",
    code: [
        "import requests",
        "",
        'target = "http://target.com/login"',
        "",
        "# SQL Injection test",
        'payload = {"user": "admin\' --", "pass": "x"}',
        "r = requests.post(target, data=payload)",
        "print(r.status_code)",
        "",
        "# XSS detection",
        'xss = "<\\script>alert(1)<\\/script>"',
        'r2 = requests.get(target, params={"q": xss})',
        "",
        "if xss in r2.text:",
        '    print("[!] XSS reflected")'
    ].join("\n")
},

  "Cryptography": { lang: "python", code: `from Crypto.Cipher import AES
  from Crypto.Random import get_random_bytes
  import base64

  key = get_random_bytes(16)
  cipher = AES.new(key, AES.MODE_EAX)

  message = b"CTF flag: flag{zyrown_1337}"
  ciphertext, tag = cipher.encrypt_and_digest(message)
  print("Encrypted:", base64.b64encode(ciphertext).decode())

  cipher2 = AES.new(key, AES.MODE_EAX, nonce=cipher.nonce)
  plaintext = cipher2.decrypt(ciphertext)
  print("Decrypted:", plaintext.decode())` },

"Reverse Engineering": {
    lang: "python",
    code: `import angr

proj = angr.Project('./crackme', auto_load_libs=False)
state = proj.factory.entry_state()
simgr = proj.factory.simulation_manager(state)

simgr.explore(
    find=lambda s: b"Correct!" in s.posix.dumps(1),
    avoid=lambda s: b"Wrong!" in s.posix.dumps(1)
)

if simgr.found:
    print(simgr.found[0].posix.dumps(0))`
},
    };
    const skills: Record<string, string[]> = {
        "Backend & Systems": ["C#", "C++", ".NET", "ASP.NET Core", "Entity Framework", "Python", "FastAPI", "Django", "Flask", "Go", "Rust", "Node.js", "Express.js", "NestJS", "Lua", "GLua"],
        "Frontend & Web": ["HTML5", "CSS3", "Tailwind CSS", "JavaScript", "TypeScript", "Svelte", "SvelteKit"],
        "Scripting & Game Dev": ["GLua (Garry's Mod)", "Lua"],
        "DevOps & Cloud": ["CI/CD (GitHub Actions)", "Terraform", "Ansible"],
        "Security & Networking": ["Web Exploitation", "Cryptography", "Forensics", "Reverse Engineering", "Offensive Security", "Network Security", "Wireshark", "Burp Suite", "Metasploit", "Root Me", "TryHackMe"],
        "Databases & Data": ["MySQL", "SQLite", "MongoDB", "SQL"],
    };

    const experience = [
        {
            id: "ctf",
            company: "Campus Cyber — Puteaux",
            role: "CTF Participant",
            period: "May 2025",
            tag: "Cybersecurity",
            color: "violet",
            points: [
                "1st place in Root Me Pro CTF organized at Campus Cyber Puteaux.",
                "Solved challenges in web exploitation, cryptography, and digital forensics.",
            ],
        },
        {
            id: "server",
            company: "Personal Production Infrastructure",
            role: "Systems Administrator",
            period: "2024 – Present",
            tag: "Infrastructure",
            color: "sky",
            points: [
                "Deployed and hardened a production-grade dedicated bare-metal server.",
                "Implemented containerization, reverse proxy, SSL automation, backups, and security hardening.",
                "Full Linux administration, monitoring, and 24/7 service management.",
            ],
        },
        {
            id: "dev",
            company: "Personal Projects",
            role: "Full-Stack Developer",
            period: "2023 – Present",
            tag: "Development",
            color: "indigo",
            points: [
                "Building robust applications in C#, C++, TypeScript, and Python.",
                "GLua scripting for Garry's Mod (addons, gamemodes, server-side logic).",
                "Self-taught Full-Stack development through hands-on projects.",
            ],
        },
    ];

    const tagColor: Record<string, string> = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    const dotColor: Record<string, string> = {
        indigo: "bg-indigo-500 shadow-indigo-500/50",
        violet: "bg-violet-500 shadow-violet-500/50",
        sky: "bg-sky-500 shadow-sky-500/50",
        emerald: "bg-emerald-500 shadow-emerald-500/50",
    };

    function openSnippet(skill: string) {
        const s = snippets[skill];
        if (s) selectedSnippet = { name: skill, ...s };
    }

    function closeSnippet() {
        selectedSnippet = null;
    }

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        visibleSections = new Set([...visibleSections, e.target.id]);
                    }
                });
            },
            { threshold: 0.1 },
        );
        document.querySelectorAll("[data-observe]").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    });

    function isVisible(id: string) {
        return visibleSections.has(id);
    }
</script>

<svelte:head>
    <title>zyRoWn | Full-Stack Developer & CTF Player</title>
</svelte:head>

{#if selectedSnippet}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        transition:fade={{ duration: 150 }}
        onclick={closeSnippet}
        role="dialog"
        aria-modal="true"
    >
        <div
            class="relative w-full max-w-2xl rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
            onclick={(e) => e.stopPropagation()}
            transition:fly={{ y: 20, duration: 200 }}
        >
            <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-accent-400"></span>
                    <span class="font-mono text-sm text-accent-400">{selectedSnippet.name}</span>
                    <span class="text-xs text-zinc-600 font-mono">.{selectedSnippet.lang}</span>
                </div>
                <button onclick={closeSnippet} class="text-zinc-500 hover:text-zinc-200 transition-colors text-xl leading-none">x</button>
            </div>
            <pre class="overflow-x-auto p-5 text-sm text-zinc-300 font-mono leading-relaxed max-h-[60vh] overflow-y-auto"><code>{selectedSnippet.code}</code></pre>
        </div>
    </div>
{/if}

<section id="about" data-observe class="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#27272a18_1px,transparent_1px),linear-gradient(to_bottom,#27272a18_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-[120px] pointer-events-none"></div>
    <div class="relative max-w-5xl mx-auto w-full pt-24 pb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-8">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available · Based in France
        </div>
        <p class="font-mono text-accent-400 text-sm mb-4 tracking-wider">Hello, I'm</p>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-[1.05]">
            <span class="text-zinc-50">zyRoWn</span><br />
            <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Full-Stack Developer & CTF Player
            </span>
        </h1>
        <p class="text-lg sm:text-xl text-zinc-400 font-medium mb-6">
            TypeScript · Python · C# · C++ · GLua
            <span class="text-zinc-600 mx-2">·</span>
            <span class="font-mono text-sm text-zinc-500">1st Place — Root Me Pro CTF @ Campus Cyber 2025</span>
        </p>
        <p class="max-w-2xl text-zinc-400 text-base leading-relaxed mb-10">
            Passionate about software engineering and offensive cybersecurity.
            I build scalable applications, robust backend systems, and immersive game experiences with GLua.
            Specialized in production infrastructure and high-impact CTF challenges.
        </p>
        <div class="flex flex-wrap gap-4">
            <a href="https://github.com/LtDragibusDev" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 group">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
            </a>
        </div>
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span class="text-xs font-mono text-zinc-500 tracking-widest uppercase">scroll</span>
            <div class="w-px h-10 bg-gradient-to-b from-zinc-500 to-transparent"></div>
        </div>
    </div>
</section>

<section id="experience" class="py-24 px-6">
    <div class="max-w-5xl mx-auto">
        <div id="exp-header" data-observe
            class="mb-16 transition-all duration-700 {isVisible('exp-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
            <p class="font-mono text-accent-400 text-xs tracking-widest uppercase mb-3">02. Journey</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-zinc-50">Experience</h2>
            <div class="mt-4 h-px w-16 bg-gradient-to-r from-accent-500 to-transparent"></div>
        </div>
        <div class="relative">
            <div class="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent"></div>
            <div class="flex flex-col gap-12">
                {#each experience as job, i}
                    <div id={job.id} data-observe
                        class="relative pl-8 md:pl-14 transition-all duration-700 {isVisible(job.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}"
                        style="transition-delay: {i * 100}ms">
                        <div class="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full {dotColor[job.color]} shadow-[0_0_12px] border-2 border-[#09090b]"></div>
                        <div class="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 md:p-6 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300">
                            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                <div>
                                    <div class="flex flex-wrap items-center gap-2 mb-1">
                                        <span class="text-xs font-mono font-medium px-2 py-0.5 rounded border {tagColor[job.color]}">{job.tag}</span>
                                    </div>
                                    <h3 class="text-zinc-100 font-semibold text-lg leading-tight">{job.role}</h3>
                                    <p class="text-zinc-500 text-sm mt-0.5">{job.company}</p>
                                </div>
                                <span class="font-mono text-xs text-zinc-500 whitespace-nowrap shrink-0 mt-1 bg-zinc-800/50 px-2.5 py-1 rounded-md">{job.period}</span>
                            </div>
                            <ul class="space-y-2">
                                {#each job.points as point}
                                    <li class="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                                        <span class="text-accent-400 shrink-0 mt-0.5">▸</span>
                                        {point}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<section id="skills" class="py-24 px-6 bg-zinc-900/20">
    <div class="max-w-5xl mx-auto">
        <div id="skills-header" data-observe
            class="mb-12 transition-all duration-700 {isVisible('skills-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
            <p class="font-mono text-accent-400 text-xs tracking-widest uppercase mb-3">03. Tech Stack</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-zinc-50">Skills & Technologies</h2>
            <div class="mt-4 h-px w-16 bg-gradient-to-r from-accent-500 to-transparent"></div>
            <p class="mt-3 text-xs text-zinc-500 font-mono">  click a skill to see a code example</p>
        </div>
        <div id="skills-tabs" data-observe
            class="transition-all duration-700 delay-100 {isVisible('skills-tabs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
            <div class="flex flex-wrap gap-2 mb-8">
                {#each skillTabs as tab}
                    <button
                        onclick={() => (activeSkillTab = tab)}
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {activeSkillTab === tab
                            ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                            : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/50'}">
                        {tab}
                    </button>
                {/each}
            </div>
            <div class="flex flex-wrap gap-3 min-h-[140px]">
                {#each skills[activeSkillTab] as skill (skill)}
                    {@const hasSnippet = !!snippets[skill]}
                    <button
                        onclick={() => openSnippet(skill)}
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border text-sm font-medium transition-all duration-200 group
                            {hasSnippet
                                ? 'border-zinc-800 text-zinc-300 hover:border-accent-500/50 hover:text-accent-400 cursor-pointer'
                                : 'border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 cursor-default'}"
                        in:fly={{ y: 8, duration: 250, delay: 50 }}
                    >
                        <span class="w-1.5 h-1.5 rounded-full {hasSnippet ? 'bg-accent-400' : 'bg-zinc-600'} group-hover:scale-125 transition-transform duration-200"></span>
                        {skill}
                        {#if hasSnippet}
                            <span class="text-xs text-zinc-600 group-hover:text-accent-500 font-mono">&lt;/&gt;</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
        <div id="skills-stats" data-observe
            class="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-200 {isVisible('skills-stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
            {#each [
                { label: "Languages & Frameworks", value: "20+" },
                { label: "CTF Ranking", value: "1st — 2025" },
                { label: "Years Active", value: "5+" },
                { label: "Core Domains", value: "Dev · Sec · Infra" },
            ] as stat}
                <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-center hover:border-zinc-700 transition-colors duration-200">
                    <p class="text-2xl font-bold text-zinc-50 mb-1">{stat.value}</p>
                    <p class="text-xs text-zinc-500">{stat.label}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<section id="contact" class="py-24 px-6">
    <div class="max-w-5xl mx-auto">
        <div id="contact-inner" data-observe
            class="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50 p-10 md:p-16 text-center relative overflow-hidden transition-all duration-700 {isVisible('contact-inner') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <p class="font-mono text-accent-400 text-xs tracking-widest uppercase mb-4">04. Get In Touch</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">Contact</h2>
            <p class="text-zinc-400 max-w-lg mx-auto leading-relaxed mb-10">
                Open to collaborations, freelance opportunities, or just interesting conversations.
                Feel free to reach out on Discord or GitHub.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https:github.com/LtDragibusDev" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm font-semibold hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub — LtDragibusDev
                </a>
            </div>
        </div>
        <footer class="mt-16 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p class="font-mono">
                <span class="text-accent-400">&gt;_</span> zyRoWn · built with
                <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 transition-colors underline underline-offset-2">SvelteKit</a>
                &
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 transition-colors underline underline-offset-2">Tailwind CSS</a>
            </p>
            <p>© {new Date().getFullYear()} zyRoWn. All rights reserved.</p>
        </footer>
    </div>
</section>
