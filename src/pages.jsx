import { useState } from 'react'
import { Link } from 'react-router-dom'
import { experiences, provider } from './data'
import { AiInterpretation, Badge, BookingModal, Button, DashboardLayout, EmptyState, ExperienceCard, NetworkGraph, PriceFlow, SectionTitle, StatCard, Status, Toast, TrustProfile, VerificationTimeline, VoiceAssistant } from './components'
import { HomeSearch } from './touristPages'

const pillars = [['01', 'AI', 'Yatra AI converts intent into verified local experiences.'], ['02', 'TRUST', 'Every provider is represented by a transparent trust profile.'], ['03', 'OPEN NETWORK', 'One discovery layer for guides, homestays and cultural hosts.'], ['04', 'FAIR TRADE', 'A direct economic model that keeps value with locals.']]

export function LandingPage() {
    return (
        <div className="pro-landing v2">
            <style>{`
                .v2 {
                    --ink:#172033;
                    --ink2:#222c40;
                    --muted:#697385;
                    --cream:#f5f1e8;
                    --paper:#fffdf8;
                    --olive:#69784b;
                    --olive2:#879a60;
                    --oliveDark:#35452a;
                    --gold:#c9a15b;
                    --gold2:#ead3a0;
                    --line:rgba(23,32,51,.10);
                    --shadow:0 25px 70px rgba(23,32,51,.12);
                    background:
                        radial-gradient(circle at 5% 12%,rgba(201,161,91,.16),transparent 20%),
                        radial-gradient(circle at 92% 6%,rgba(105,120,75,.13),transparent 22%),
                        var(--cream);
                    color:var(--ink);
                    overflow:hidden;
                }

                .v2 *{box-sizing:border-box}
                .v2 a{text-decoration:none;color:inherit}
                .v2 button{font:inherit}
                .v2 .noise{
                    position:fixed;inset:0;z-index:100;pointer-events:none;opacity:.035;
                    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
                }

                .v2 .nav{
                    position:sticky;top:0;z-index:60;height:78px;
                    display:flex;align-items:center;justify-content:space-between;gap:25px;
                    padding:0 clamp(18px,5vw,72px);
                    background:rgba(245,241,232,.72);backdrop-filter:blur(22px);
                    border-bottom:1px solid rgba(23,32,51,.07);
                }
                .v2 .brand{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:950;letter-spacing:.10em;white-space:nowrap}
                .v2 .brand-mark{
                    width:39px;height:39px;border-radius:13px;display:grid;place-items:center;
                    color:white;background:linear-gradient(145deg,var(--olive2),var(--oliveDark));
                    box-shadow:0 10px 25px rgba(53,69,42,.25);
                    transition:transform .35s ease;
                }
                .v2 .brand:hover .brand-mark{transform:rotate(12deg) scale(1.08)}
                .v2 .brand b{color:var(--olive)}
                .v2 .navlinks{display:flex;gap:30px;color:#626b79;font-size:12px;font-weight:800}
                .v2 .navlinks a{position:relative;padding:8px 0}
                .v2 .navlinks a:after{
                    content:"";position:absolute;left:0;right:100%;bottom:0;height:2px;
                    background:var(--gold);transition:right .3s ease;
                }
                .v2 .navlinks a:hover{color:var(--ink)}
                .v2 .navlinks a:hover:after{right:0}
                .v2 .navactions{display:flex;gap:8px}
                .v2 .btn{
                    position:relative;display:inline-flex;align-items:center;justify-content:center;gap:9px;
                    min-height:46px;padding:0 19px;border-radius:13px;border:1px solid transparent;
                    font-size:12px;font-weight:900;overflow:hidden;cursor:pointer;
                    transition:transform .25s ease,box-shadow .25s ease,background .25s ease,border-color .25s ease;
                }
                .v2 .btn:before{
                    content:"";position:absolute;inset:0;transform:translateX(-110%);
                    background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent);
                    transition:transform .55s ease;
                }
                .v2 .btn:hover:before{transform:translateX(110%)}
                .v2 .btn>*{position:relative}
                .v2 .btn-dark{background:var(--ink);color:#fff!important;box-shadow:0 10px 25px rgba(23,32,51,.18)}
                .v2 .btn-dark:hover{transform:translateY(-3px);background:var(--oliveDark);box-shadow:0 18px 35px rgba(53,69,42,.24)}
                .v2 .btn-light{background:rgba(255,255,255,.55);border-color:var(--line)}
                .v2 .btn-light:hover{transform:translateY(-3px);background:#fff;box-shadow:0 14px 30px rgba(23,32,51,.09)}

                .v2 .hero{
                    position:relative;min-height:calc(100vh - 78px);padding:65px clamp(18px,5vw,72px) 95px;
                    display:flex;align-items:center;
                }
                .v2 .orb{position:absolute;border-radius:50%;filter:blur(1px);pointer-events:none}
                .v2 .orb.one{width:300px;height:300px;right:-90px;top:100px;background:rgba(105,120,75,.11);animation:orb 8s ease-in-out infinite}
                .v2 .orb.two{width:190px;height:190px;left:2%;bottom:40px;background:rgba(201,161,91,.10);animation:orb 10s ease-in-out infinite reverse}
                @keyframes orb{50%{transform:translate(18px,-20px) scale(1.08)}}

                .v2 .hero-grid{
                    position:relative;z-index:2;width:100%;max-width:1370px;margin:auto;
                    display:grid;grid-template-columns:minmax(0,1fr) minmax(450px,.9fr);
                    gap:clamp(45px,6vw,95px);align-items:center;
                }
                .v2 .eyebrow{
                    display:flex;align-items:center;gap:9px;color:var(--olive);
                    font-size:10px;font-weight:950;letter-spacing:.18em;
                }
                .v2 .eyebrow:before{content:"";width:32px;height:1px;background:var(--gold)}
                .v2 .hero h1{
                    max-width:820px;margin:20px 0 0;font-family:Georgia,"Times New Roman",serif;
                    font-size:clamp(54px,6.7vw,94px);line-height:.92;letter-spacing:-.065em;font-weight:500;
                }
                .v2 .hero h1 em{font-style:italic;color:var(--olive)}
                .v2 .hero-desc{max-width:650px;margin:27px 0 0;color:var(--muted);font-size:16px;line-height:1.8}
                .v2 .hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:31px}
                .v2 .microproof{display:flex;flex-wrap:wrap;gap:19px;margin-top:28px;color:#777f8a;font-size:11px;font-weight:800}
                .v2 .microproof span{display:flex;align-items:center;gap:7px}
                .v2 .microproof i{width:6px;height:6px;border-radius:50%;background:var(--olive2);box-shadow:0 0 0 5px rgba(135,154,96,.12)}

                .v2 .hero-card{
                    position:relative;height:min(660px,68vw);min-height:540px;
                    perspective:1200px;
                }
                .v2 .hero-image{
                    position:absolute;inset:10px 0 25px 28px;border-radius:32px;overflow:hidden;
                    transform:rotate(2deg);box-shadow:0 35px 90px rgba(23,32,51,.22);
                    transition:transform .6s cubic-bezier(.2,.8,.2,1),box-shadow .6s ease;
                }
                .v2 .hero-card:hover .hero-image{transform:rotate(0) translateY(-7px) scale(1.015);box-shadow:0 45px 110px rgba(23,32,51,.28)}
                .v2 .hero-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s ease}
                .v2 .hero-card:hover .hero-image img{transform:scale(1.08)}
                .v2 .hero-image:after{
                    content:"";position:absolute;inset:0;
                    background:linear-gradient(180deg,rgba(10,15,20,.02) 35%,rgba(10,15,20,.68));
                }
                .v2 .hero-location{
                    position:absolute;z-index:4;left:0;bottom:70px;width:280px;padding:18px;
                    border:1px solid rgba(255,255,255,.55);border-radius:18px;background:rgba(255,253,248,.91);
                    box-shadow:0 20px 45px rgba(23,32,51,.18);backdrop-filter:blur(16px);
                    animation:float 4.5s ease-in-out infinite;
                }
                .v2 .hero-location small{color:var(--olive);font-size:9px;font-weight:950;letter-spacing:.14em}
                .v2 .hero-location b{display:block;margin-top:6px;font-size:16px}
                .v2 .hero-location span{display:block;margin-top:5px;color:var(--muted);font-size:11px;line-height:1.5}
                .v2 .hero-score{
                    position:absolute;z-index:5;right:-15px;top:58px;width:150px;padding:18px;
                    color:#fff;background:rgba(23,32,51,.94);border:1px solid rgba(255,255,255,.14);
                    border-radius:20px;box-shadow:0 20px 45px rgba(23,32,51,.22);
                    animation:float 5s ease-in-out infinite reverse;
                }
                .v2 .hero-score small{font-size:8px;letter-spacing:.14em;opacity:.65;font-weight:900}
                .v2 .hero-score strong{display:block;margin-top:4px;font:500 45px Georgia,serif}
                .v2 .hero-score span{font-size:10px;color:#c8d2bb}
                .v2 .hero-chip{
                    position:absolute;z-index:5;right:28px;bottom:12px;padding:9px 13px;
                    border-radius:999px;color:#fff;background:rgba(23,32,51,.75);backdrop-filter:blur(12px);
                    font-size:9px;font-weight:900;letter-spacing:.08em;
                }
                @keyframes float{50%{transform:translateY(-10px)}}

                .v2 .marquee{
                    overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
                    background:#1a2333;color:#fff;
                }
                .v2 .marquee-track{
                    display:flex;width:max-content;animation:marquee 24s linear infinite;
                    padding:14px 0;
                }
                .v2 .marquee-item{display:flex;align-items:center;gap:18px;padding:0 28px;font-size:10px;font-weight:900;letter-spacing:.13em;white-space:nowrap}
                .v2 .marquee-item i{width:5px;height:5px;border-radius:50%;background:var(--gold)}
                @keyframes marquee{to{transform:translateX(-50%)}}

                .v2 .section{padding:115px clamp(18px,5vw,72px)}
                .v2 .container{max-width:1370px;margin:auto}
                .v2 .section-title{max-width:850px;margin:18px 0 0;font:500 clamp(42px,5.4vw,72px)/.98 Georgia,serif;letter-spacing:-.05em}
                .v2 .section-title em{color:var(--olive);font-style:italic}
                .v2 .section-copy{max-width:650px;color:var(--muted);font-size:15px;line-height:1.8;margin:18px 0 0}

                .v2 .bento{
                    display:grid;grid-template-columns:1.1fr .9fr .9fr;grid-template-rows:260px 260px;
                    gap:14px;margin-top:60px;
                }
                .v2 .bento-card{
                    position:relative;overflow:hidden;padding:28px;border:1px solid var(--line);border-radius:25px;
                    background:rgba(255,255,255,.5);transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s ease,border-color .4s ease;
                }
                .v2 .bento-card:hover{transform:translateY(-9px);box-shadow:0 28px 60px rgba(23,32,51,.12);border-color:rgba(105,120,75,.3)}
                .v2 .bento-main{grid-row:span 2;color:#fff;background:linear-gradient(145deg,#34442a,#69784b)}
                .v2 .bento-main:after{
                    content:"";position:absolute;width:260px;height:260px;right:-90px;bottom:-100px;border-radius:50%;
                    background:rgba(255,255,255,.09);transition:transform .5s ease;
                }
                .v2 .bento-main:hover:after{transform:scale(1.5)}
                .v2 .bento-num{font-size:10px;font-weight:950;letter-spacing:.14em;color:var(--gold)}
                .v2 .bento-card h3{position:relative;z-index:2;margin:65px 0 10px;font-size:20px}
                .v2 .bento-main h3{font:500 46px/.98 Georgia,serif;max-width:400px}
                .v2 .bento-card p{position:relative;z-index:2;color:var(--muted);font-size:12px;line-height:1.7;margin:0;max-width:390px}
                .v2 .bento-main p{color:rgba(255,255,255,.72);font-size:14px}
                .v2 .bento-icon{
                    position:absolute;right:25px;top:23px;width:45px;height:45px;border-radius:14px;
                    display:grid;place-items:center;background:rgba(255,255,255,.12);font-size:18px;
                }

                .v2 .ai-section{
                    padding:115px clamp(18px,5vw,72px);color:#fff;
                    background:
                        radial-gradient(circle at 75% 15%,rgba(201,161,91,.18),transparent 24%),
                        radial-gradient(circle at 15% 90%,rgba(135,154,96,.14),transparent 25%),
                        linear-gradient(135deg,#151f30,#29365f);
                }
                .v2 .ai-grid{max-width:1370px;margin:auto;display:grid;grid-template-columns:.75fr 1.25fr;gap:75px;align-items:center}
                .v2 .ai-section .eyebrow{color:#dfc991}
                .v2 .ai-title{margin:18px 0 0;font:500 clamp(43px,5.5vw,75px)/.96 Georgia,serif;letter-spacing:-.05em}
                .v2 .ai-title em{color:#dec38a;font-style:italic}
                .v2 .ai-copy{max-width:510px;color:rgba(255,255,255,.65);line-height:1.8;font-size:14px}
                .v2 .ai-console{
                    position:relative;padding:25px;border:1px solid rgba(255,255,255,.13);border-radius:28px;
                    background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,255,255,.035));
                    box-shadow:0 35px 80px rgba(0,0,0,.22);backdrop-filter:blur(16px);
                    transition:transform .4s ease,box-shadow .4s ease;
                }
                .v2 .ai-console:hover{transform:translateY(-8px) rotateX(1deg);box-shadow:0 45px 100px rgba(0,0,0,.3)}
                .v2 .ai-top{display:flex;align-items:center;gap:7px;margin-bottom:20px}
                .v2 .ai-dot{width:8px;height:8px;border-radius:50%;background:#8ea66b;box-shadow:0 0 0 6px rgba(142,166,107,.1)}
                .v2 .ai-top span{margin-left:4px;color:rgba(255,255,255,.45);font-size:9px;font-weight:900;letter-spacing:.13em}
                .v2 .ai-prompt{padding:18px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(0,0,0,.13);font-size:13px;line-height:1.6;color:rgba(255,255,255,.78)}
                .v2 .ai-results{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:11px}
                .v2 .ai-result{padding:17px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.055);transition:transform .3s ease,background .3s ease}
                .v2 .ai-result:hover{transform:translateY(-7px);background:rgba(255,255,255,.12)}
                .v2 .ai-result span{color:#d7bd87;font-size:8px;font-weight:950}
                .v2 .ai-result b{display:block;margin-top:8px;font-size:12px}
                .v2 .ai-result small{display:block;margin-top:6px;color:rgba(255,255,255,.48);font-size:10px;line-height:1.45}

                .v2 .trust-section{padding:115px clamp(18px,5vw,72px);background:#fffdf8}
                .v2 .trust-grid{max-width:1370px;margin:auto;display:grid;grid-template-columns:.8fr 1.2fr;gap:80px;align-items:center}
                .v2 .trust-card{
                    position:relative;padding:29px;border:1px solid var(--line);border-radius:28px;background:#fff;
                    box-shadow:var(--shadow);transition:transform .4s ease,box-shadow .4s ease;
                }
                .v2 .trust-card:hover{transform:translateY(-9px) rotate(-.5deg);box-shadow:0 38px 90px rgba(23,32,51,.15)}
                .v2 .trust-profile{display:flex;align-items:center;gap:15px;padding-bottom:22px;border-bottom:1px solid var(--line)}
                .v2 .trust-profile img{width:62px;height:62px;border-radius:18px;object-fit:cover}
                .v2 .trust-profile b{display:block;font-size:16px}
                .v2 .trust-profile span{display:block;color:var(--muted);font-size:11px;margin-top:4px}
                .v2 .trust-score{margin-left:auto;text-align:right}
                .v2 .trust-score strong{display:block;color:var(--olive);font:500 35px Georgia,serif}
                .v2 .trust-score small{color:#8d949e;font-size:8px;font-weight:900}
                .v2 .trust-grid-items{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:20px}
                .v2 .trust-item{padding:16px;border-radius:14px;background:#f5f6f0;font-size:11px;font-weight:850;transition:transform .25s ease,background .25s ease}
                .v2 .trust-item:hover{transform:translateX(4px);background:#edf0e5}
                .v2 .trust-item span{color:var(--olive);margin-right:7px}

                .v2 .stats{
                    display:grid;grid-template-columns:repeat(4,1fr);max-width:1370px;margin:auto;
                    border-top:1px solid var(--line);border-bottom:1px solid var(--line);
                }
                .v2 .stat{padding:38px 25px;border-right:1px solid var(--line);transition:background .25s ease}
                .v2 .stat:last-child{border:0}
                .v2 .stat:hover{background:rgba(105,120,75,.06)}
                .v2 .stat strong{display:block;font:500 39px Georgia,serif}
                .v2 .stat span{display:block;margin-top:8px;color:var(--muted);font-size:10px;font-weight:750}

                .v2 .network-section{padding:115px clamp(18px,5vw,72px);background:#ece7dc}
                .v2 .network-inner{max-width:1370px;margin:auto;text-align:center}
                .v2 .network-stage{
                    position:relative;height:470px;margin-top:55px;overflow:hidden;border:1px solid rgba(23,32,51,.08);
                    border-radius:30px;background:
                        radial-gradient(circle at center,rgba(105,120,75,.16),transparent 16%),
                        radial-gradient(circle at 25% 35%,rgba(201,161,91,.13),transparent 14%),
                        rgba(255,255,255,.45);
                }
                .v2 .network-line{position:absolute;left:15%;right:15%;top:50%;height:1px;background:rgba(105,120,75,.24);transform-origin:center}
                .v2 .network-line.l1{transform:rotate(19deg)}
                .v2 .network-line.l2{transform:rotate(-19deg)}
                .v2 .network-line.l3{transform:rotate(55deg)}
                .v2 .node{
                    position:absolute;z-index:3;width:95px;height:95px;display:grid;place-items:center;text-align:center;
                    border-radius:50%;border:8px solid rgba(255,255,255,.82);color:#fff;background:var(--olive);
                    font-size:9px;font-weight:950;letter-spacing:.05em;box-shadow:0 15px 35px rgba(23,32,51,.15);
                    transition:transform .4s ease,box-shadow .4s ease;
                }
                .v2 .node:hover{transform:scale(1.15);box-shadow:0 22px 50px rgba(105,120,75,.3)}
                .v2 .node.center{left:calc(50% - 62px);top:calc(50% - 62px);width:124px;height:124px;background:var(--ink);font-size:10px;line-height:1.35}
                .v2 .node.n1{left:9%;top:22%}.v2 .node.n2{left:25%;bottom:12%}.v2 .node.n3{right:25%;bottom:12%}.v2 .node.n4{right:8%;top:22%}

                .v2 .final-wrap{padding:0 0 90px;background:#ece7dc}
                .v2 .final{
                    max-width:1370px;margin:auto;padding:80px clamp(24px,5vw,70px);border-radius:32px;
                    display:flex;align-items:center;justify-content:space-between;gap:30px;color:#fff;
                    background:
                        radial-gradient(circle at 80% 25%,rgba(201,161,91,.24),transparent 24%),
                        linear-gradient(135deg,#35452a,#1e291b);
                    box-shadow:0 35px 90px rgba(53,69,42,.2);
                }
                .v2 .final h2{margin:17px 0 0;font:500 clamp(42px,5vw,67px)/.98 Georgia,serif;letter-spacing:-.05em}
                .v2 .final h2 em{color:#dfc58d;font-style:italic}
                .v2 .final .eyebrow{color:#dec68e}

                .v2 .footer{padding:55px clamp(18px,5vw,72px);background:#141c2a;color:#fff}
                .v2 .footer-inner{max-width:1370px;margin:auto;display:flex;justify-content:space-between;gap:50px}
                .v2 .footer p{max-width:410px;color:rgba(255,255,255,.48);font-size:12px;line-height:1.7}
                .v2 .footer-links{display:flex;gap:24px;color:rgba(255,255,255,.64);font-size:11px;font-weight:800}
                .v2 .footer-links a:hover{color:#fff}
                .v2 .footer-bottom{max-width:1370px;margin:38px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.09);color:rgba(255,255,255,.35);font-size:10px}

                @media(max-width:1050px){
                    .v2 .navlinks{display:none}
                    .v2 .hero-grid,.v2 .ai-grid,.v2 .trust-grid{grid-template-columns:1fr}
                    .v2 .hero-card{height:560px}
                    .v2 .bento{grid-template-columns:1fr 1fr;grid-template-rows:280px 280px}
                    .v2 .bento-main{grid-row:span 2}
                }
                @media(max-width:700px){
                    .v2 .nav{height:68px;padding:0 15px}
                    .v2 .navactions .btn-light{display:none}
                    .v2 .brand{font-size:10px}
                    .v2 .hero{padding:45px 15px 70px}
                    .v2 .hero h1{font-size:49px}
                    .v2 .hero-card{height:430px;min-height:430px}
                    .v2 .hero-image{inset:8px 0 18px 8px}
                    .v2 .hero-location{left:0;bottom:35px;width:245px}
                    .v2 .hero-score{right:-2px;top:30px;width:130px}
                    .v2 .section,.v2 .ai-section,.v2 .trust-section,.v2 .network-section{padding:75px 15px}
                    .v2 .section-title{font-size:43px}
                    .v2 .bento{display:flex;flex-direction:column}
                    .v2 .bento-card,.v2 .bento-main{min-height:240px}
                    .v2 .bento-main h3{font-size:38px}
                    .v2 .ai-results,.v2 .trust-grid-items{grid-template-columns:1fr}
                    .v2 .stats{grid-template-columns:1fr 1fr}
                    .v2 .stat{border-bottom:1px solid var(--line)}
                    .v2 .stat:nth-child(2){border-right:0}
                    .v2 .final{margin:0 15px;padding:55px 24px;flex-direction:column;align-items:flex-start}
                    .v2 .footer-inner{flex-direction:column}
                    .v2 .footer-links{flex-wrap:wrap}
                }
                @media(prefers-reduced-motion:reduce){
                    .v2 *,.v2 *:before,.v2 *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
                }
            `}</style>

            <div className="noise" />

            <header className="nav">
                <Link className="brand" to="/">
                    <span className="brand-mark">✦</span>
                    <span>BHARAT YATRA <b>SETU</b></span>
                </Link>
                <nav className="navlinks">
                    <a href="#why">Why Setu</a>
                    <a href="#ai">Yatra AI</a>
                    <a href="#trust">Trust</a>
                    <a href="#network">Network</a>
                </nav>
                <div className="navactions">
                    <Link className="btn btn-light" to="/login">Log in</Link>
                    <Link className="btn btn-dark" to="/signup">Start exploring <span>↗</span></Link>
                </div>
            </header>

            <section className="hero">
                <div className="orb one" />
                <div className="orb two" />
                <div className="hero-grid">
                    <div>
                        <div className="eyebrow">THE LOCAL HERITAGE ECONOMY · INDIA</div>
                        <h1>Don't just visit India.<br /><em>Meet the people</em> who make it.</h1>
                        <p className="hero-desc">
                            Discover verified local guides, homestays and cultural experiences.
                            Tell us what you want to feel — Yatra AI helps find the right connection.
                        </p>
                        <div className="hero-actions">
                            <Link className="btn btn-dark" to="/signup">Discover local experiences <span>↗</span></Link>
                            <a className="btn btn-light" href="#why">Explore the idea <span>↓</span></a>
                        </div>
                        <div className="microproof">
                            <span><i /> Verified providers</span>
                            <span><i /> Transparent trust</span>
                            <span><i /> Fair local economics</span>
                        </div>
                    </div>

                    <div className="hero-card">
                        <div className="hero-image">
                            <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1500&q=90" alt="Amer Fort in Jaipur" />
                        </div>
                        <div className="hero-location">
                            <small>FEATURED DESTINATION</small>
                            <b>Amer, Jaipur</b>
                            <span>Living heritage, locally told. Go beyond the postcard.</span>
                        </div>
                        <div className="hero-score">
                            <small>LOCAL TRUST</small>
                            <strong>94</strong>
                            <span>Verified provider network</span>
                        </div>
                        <div className="hero-chip">✦ 9 HERITAGE CITIES</div>
                    </div>
                </div>
            </section>

            <div className="marquee">
                <div className="marquee-track">
                    {['GUIDES','HOMESTAYS','ARTISANS','LOCAL FOOD','HERITAGE','YATRA AI','TRUST','FAIR TRADE','GUIDES','HOMESTAYS','ARTISANS','LOCAL FOOD','HERITAGE','YATRA AI','TRUST','FAIR TRADE'].map((item, index) => (
                        <span className="marquee-item" key={`${item}-${index}`}><i />{item}</span>
                    ))}
                </div>
            </div>

            <section className="section" id="why">
                <div className="container">
                    <div className="eyebrow">WHY BHARAT YATRA SETU</div>
                    <h2 className="section-title">A smarter way to discover <em>the India behind the postcard.</em></h2>
                    <p className="section-copy">Discovery, trust and fair local participation come together in one experience layer.</p>

                    <div className="bento">
                        <article className="bento-card bento-main">
                            <span className="bento-num">01 · AI</span>
                            <div className="bento-icon">✦</div>
                            <h3>Intent becomes a meaningful local connection.</h3>
                            <p>Instead of searching endless listings, describe your time, mood, budget and interests.</p>
                        </article>
                        <article className="bento-card">
                            <span className="bento-num">02 · TRUST</span>
                            <div className="bento-icon">◈</div>
                            <h3>Trust, made visible.</h3>
                            <p>Identity, experience and verification signals are presented clearly.</p>
                        </article>
                        <article className="bento-card">
                            <span className="bento-num">03 · NETWORK</span>
                            <div className="bento-icon">⌁</div>
                            <h3>One open network.</h3>
                            <p>Guides, hosts, artisans and travellers share one discovery layer.</p>
                        </article>
                        <article className="bento-card">
                            <span className="bento-num">04 · FAIR TRADE</span>
                            <div className="bento-icon">₹</div>
                            <h3>Value stays local.</h3>
                            <p>Transparent pricing makes direct local participation easier to understand.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="ai-section" id="ai">
                <div className="ai-grid">
                    <div>
                        <div className="eyebrow">THE INTELLIGENCE LAYER</div>
                        <h2 className="ai-title">Tell Yatra AI what you <em>feel like.</em></h2>
                        <p className="ai-copy">Describe your mood, time, budget and interests in natural language. The prototype turns that intent into understandable local matches.</p>
                        <Link className="btn btn-dark" to="/explore?ai=1">Try Yatra AI <span>↗</span></Link>
                    </div>
                    <div className="ai-console">
                        <div className="ai-top"><i className="ai-dot" /><i className="ai-dot" /><i className="ai-dot" /><span>YATRA AI · LIVE PROTOTYPE</span></div>
                        <div className="ai-prompt">“I have 3 hours in Jaipur. I want something authentic, calm and food-focused.”</div>
                        <div className="ai-results">
                            <div className="ai-result"><span>94 TRUST</span><b>Old City Food Walk</b><small>Local flavours · 2.5 hrs</small></div>
                            <div className="ai-result"><span>92 TRUST</span><b>Pink City Crafts</b><small>Artisan stories · 2 hrs</small></div>
                            <div className="ai-result"><span>90 TRUST</span><b>Heritage Breakfast</b><small>Family kitchen · 1.5 hrs</small></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trust-section" id="trust">
                <div className="trust-grid">
                    <div>
                        <div className="eyebrow">TRUST SHOULD BE VISIBLE</div>
                        <h2 className="section-title">Know <em>who</em> you're meeting.</h2>
                        <p className="section-copy">Identity, documents, location, experience and behaviour become visible signals instead of a vague star rating.</p>
                        <Link className="btn btn-dark" to="/provider/trust" style={{marginTop:24}}>See a trust profile <span>↗</span></Link>
                    </div>
                    <div className="trust-card">
                        <div className="trust-profile">
                            <img src={provider.image} alt={provider.name} />
                            <div><b>{provider.name}</b><span>Heritage guide · Jaipur</span></div>
                            <div className="trust-score"><strong>94</strong><small>TRUST SCORE</small></div>
                        </div>
                        <div className="trust-grid-items">
                            <div className="trust-item"><span>✓</span> Identity verified</div>
                            <div className="trust-item"><span>✓</span> Experience verified</div>
                            <div className="trust-item"><span>✓</span> Location checked</div>
                            <div className="trust-item"><span>✓</span> Recent activity</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{paddingTop:0}}>
                <div className="stats">
                    {[
                        ['₹18.4L','direct provider income'],
                        ['87%','repeat traveller intent'],
                        ['4.8','average local rating'],
                        ['9','heritage cities in prototype']
                    ].map(([value,label]) => (
                        <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>
                    ))}
                </div>
            </section>

            <section className="network-section" id="network">
                <div className="network-inner">
                    <div className="eyebrow">ONE OPEN NETWORK</div>
                    <h2 className="section-title" style={{margin:'18px auto 0'}}>One connection layer for <em>local India.</em></h2>
                    <p className="section-copy" style={{margin:'18px auto 0'}}>Guides, homestays, artisans and cultural hosts can become part of the same discoverable network.</p>
                    <div className="network-stage">
                        <div className="network-line l1"/><div className="network-line l2"/><div className="network-line l3"/>
                        <div className="node n1">GUIDES</div>
                        <div className="node n2">HOMESTAYS</div>
                        <div className="node center">BHARAT<br/>YATRA<br/>SETU</div>
                        <div className="node n3">ARTISANS</div>
                        <div className="node n4">TRAVELLERS</div>
                    </div>
                </div>
            </section>

            <section className="final-wrap">
                <div className="final">
                    <div>
                        <div className="eyebrow">START WITH ONE STORY</div>
                        <h2>Make your next journey<br /><em>more local.</em></h2>
                    </div>
                    <Link className="btn btn-dark" to="/signup">Explore India <span>↗</span></Link>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-inner">
                    <div>
                        <Link className="brand" to="/" style={{color:'#fff'}}>
                            <span className="brand-mark">✦</span>
                            <span>BHARAT YATRA <b>SETU</b></span>
                        </Link>
                        <p>Building the open trust and discovery layer for India's local heritage economy.</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/explore">Discover</Link>
                        <Link to="/provider/dashboard">For providers</Link>
                        <Link to="/login">Login</Link>
                        <a href="mailto:hello@bharatyatasetu.in">Contact</a>
                    </div>
                </div>
                <div className="footer-bottom">Prototype · No real payments or government verification connected</div>
            </footer>
        </div>
    )
}

export function ExplorePage() {
    const [query, setQuery] = useState('')
    const [saved, setSaved] = useState([])
    const [selected, setSelected] = useState(null)
    const [notice, setNotice] = useState('')
    const aiMode = new URLSearchParams(window.location.search).has('ai')
    const visible = experiences.filter((item) => !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    const save = (id) => setSaved((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
    return <div className="tourist-app"><div className="tourist-main"><header className="product-header"><Link className="brand" to="/"><span className="brand-mark">✦</span><span>BHARAT YATRA <b>SETU</b></span></Link><nav className="product-nav"><Link className="active" to="/explore">Discover</Link><Link to="/explore?ai=1">AI Search</Link><Link to="/bookings">Bookings</Link></nav><div className="header-right"><Link className="provider-switch" to="/provider/dashboard">For providers ↗</Link><span className="avatar avatar-small">AK</span></div></header><main className="explore-content"><SectionTitle eyebrow="DISCOVER · JAIPUR" title={<>Find a local experience that matches <em>your time, budget and interests.</em></>} copy="The best way to see a place is through someone who knows its everyday stories." action={<div className="city-select">⌖ Jaipur <span>⌄</span></div>} /><div className="explore-workspace"><aside className="explore-filter"><div className="filter-head"><b>FILTERS</b><button onClick={() => setQuery('')}>Clear all</button></div><label>Search intent<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. food, crafts, fort" /></label><div className="filter-block"><span>Experience type</span>{['Heritage walks', 'Local food', 'Culture & crafts', 'Homestays'].map((type) => <label className="check" key={type}><input type="checkbox" defaultChecked={type === 'Heritage walks'} />{type}<small>{type === 'Heritage walks' ? '12' : '8'}</small></label>)}</div><div className="filter-block"><span>Budget per person</span><div className="range-label"><b>₹0</b><b>₹2,000+</b></div><input className="range" type="range" min="0" max="2000" defaultValue="1000" /></div><div className="filter-block"><span>Trust level</span><label className="check"><input type="checkbox" defaultChecked />90+ trust score<small>24</small></label></div></aside><div className="results-column">{(aiMode || query) && <AiInterpretation />}{aiMode && <div className="results-context"><span>✦</span><b>YATRA AI FOUND 3 VERIFIED MATCHES</b><small>Ranked by your intent, not just keywords.</small></div>}<div className="results-toolbar"><span><b>{visible.length}</b> experiences near Jaipur</span><button>Recommended⌄</button></div><div className="product-experience-grid">{visible.map((item) => <ExperienceCard key={item.id} item={item} saved={saved.includes(item.id)} onSave={save} onView={setSelected} />)}</div>{!visible.length && <EmptyState title="No exact matches yet" copy="Try a wider description. Yatra AI works best with a destination, time and feeling." action={<Button onClick={() => setQuery('')}>Show all Jaipur experiences</Button>} />}</div></div></main></div><div className="tourist-bottom-nav"><Link className="active" to="/explore">⌂<span>Discover</span></Link><Link to="/explore?ai=1">✦<span>Yatra AI</span></Link><Link to="/bookings">□<span>Bookings</span></Link><Link to="/saved">♡<span>Saved</span></Link></div>{selected && <BookingModal item={selected} onClose={() => setSelected(null)} onConfirm={() => { setSelected(null); setNotice('Demo booking confirmed. No payment was processed.'); setTimeout(() => setNotice(''), 4200) }} />}<Toast message={notice} onClose={() => setNotice('')} /></div>
}

const bookingRows = [['Tomorrow · 5:00 PM', 'Amer Fort Heritage Walk', 'Ananya Kapoor', '2 guests', 'confirmed'], ['Thu · 10:30 AM', 'Amer Fort Heritage Walk', 'Maya & Kabir', '4 guests', 'pending'], ['Sat · 4:00 PM', 'Old City Culture Walk', 'Lucas Martin', '2 guests', 'confirmed']]
export function ProviderDashboard() { return <DashboardLayout><div className="dashboard-topbar"><span className="mobile-brand"><Link to="/">BYS</Link></span><span>Tuesday, 10 September 2026</span><div><Link to="/" className="view-public">View public profile ↗</Link><span className="avatar avatar-small">RK</span></div></div><main className="dashboard-content"><SectionTitle eyebrow="PROVIDER OVERVIEW" title={<>Good morning, <em>Rajesh.</em></>} copy="Here's how your local story is performing this week." action={<Button to="/provider/experiences">Manage experiences</Button>} /><div className="stats-grid"><StatCard label="Bookings this month" value="42" change="+18% vs last month" /><StatCard label="Direct earnings" value="₹33,600" change="+22% vs last month" tone="earnings" /><StatCard label="Trust score" value="94 / 100" change="Top 12% in Jaipur" tone="trust" /><StatCard label="Response rate" value="96%" change="+4% vs last month" /></div><div className="dashboard-grid"><div className="dashboard-panel bookings-panel"><div className="panel-heading"><div><span className="panel-eyebrow">UPCOMING BOOKINGS</span><h2>Be ready to welcome them.</h2></div><Link to="/provider/bookings">View all ↗</Link></div><div className="booking-list">{bookingRows.map(([date, title, person, guests, status]) => <div className="booking-row" key={person}><span className="booking-date">{date}</span><div className="booking-avatar">{person.split(' ').map((name) => name[0]).join('')}</div><div><b>{title}</b><small>{person} · {guests}</small></div><Status tone={status === 'pending' ? 'amber' : 'green'}>{status}</Status></div>)}</div></div><div className="dashboard-panel quick-panel"><span className="panel-eyebrow">QUICK ACTION</span><h2>Keep your listing current.</h2><p>Travellers trust providers who keep their availability fresh.</p><Link className="quick-action" to="/provider/availability"><span>◷</span>Update availability <b>↗</b></Link><Link className="quick-action" to="/provider/voice"><span>◉</span>Use voice assistant <b>↗</b></Link><Link className="quick-action" to="/provider/trust"><span>✦</span>Review trust profile <b>↗</b></Link></div></div><div className="dashboard-grid"><div className="dashboard-panel earnings-chart"><div className="panel-heading"><div><span className="panel-eyebrow">DIRECT EARNINGS</span><h2>₹33,600 <small>this month</small></h2></div><Badge>+22%</Badge></div><div className="fake-chart"><div className="chart-bars">{[30, 48, 40, 64, 52, 78, 70, 90, 66, 83, 74, 100].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div><div className="chart-labels"><span>01 Sep</span><span>10 Sep</span><span>20 Sep</span><span>30 Sep</span></div></div></div><div className="dashboard-panel preview-panel"><div className="panel-heading"><div><span className="panel-eyebrow">PUBLIC PREVIEW</span><h2>How travellers see you.</h2></div><Link to="/provider/trust">Edit ↗</Link></div><div className="mini-public-profile"><img src={provider.image} alt={provider.name} /><div><b>{provider.name}</b><small>Heritage guide · Jaipur</small><span>★ 4.8 · <i>94 trust</i></span></div></div><p>“Rajesh made the history of Amer feel like a conversation with a friend.”</p></div></div></main></DashboardLayout> }

export function ProviderTrustPage() { return <DashboardLayout><main className="dashboard-content narrow"><SectionTitle eyebrow="TRUST PROFILE" title={<>Make trust <em>legible.</em></>} copy="This is the profile travellers use to choose a local connection with confidence." action={<Button variant="outline" to="/provider/dashboard">Back to overview</Button>} /><TrustProfile /><VerificationTimeline /></main></DashboardLayout> }
export function ProviderVoicePage() { return <DashboardLayout><main className="dashboard-content narrow"><SectionTitle eyebrow="VOICE ASSISTANT" title={<>Your voice, <em>your availability.</em></>} copy="A practical way to keep your listing current while you are out in the field." /><VoiceAssistant /></main></DashboardLayout> }
export function ProviderSimplePage({ title, eyebrow }) { return <DashboardLayout><main className="dashboard-content"><SectionTitle eyebrow={eyebrow} title={title} copy="This operational view is part of the Bharat Yatra Setu prototype." action={<Button to="/provider/dashboard">Back to overview</Button>} /><div className="dashboard-panel"><EmptyState title="Prototype workspace ready" copy="The next slice connects this view to live provider state. The interaction model and navigation are in place." action={<Button to="/provider/dashboard">Return to overview</Button>} /></div></main></DashboardLayout> }

export function AdminDashboard({ verification = false }) {
  const [selected, setSelected] = useState(null);

  const [queue, setQueue] = useState(() => {
    const initialQueue = [
      ['Neeraj Meena', 'Local experience', 'Jodhpur', '2h ago', 'pending'],
      ['Saira Begum', 'Homestay', 'Udaipur', '5h ago', 'pending'],
      ['Vikram Rao', 'Heritage guide', 'Hampi', 'Yesterday', 'review']
    ];

    try {
      const approvedProviders = JSON.parse(
        localStorage.getItem('bys-approved-providers') || '[]'
      );

      return initialQueue.filter(
        ([name]) => !approvedProviders.includes(name)
      );
    } catch {
      return initialQueue;
    }
  });

  const approveProvider = () => {
    if (!selected) return;

    setQueue(currentQueue => {
      const updatedQueue = currentQueue.filter(
        ([name]) => name !== selected
      );

      // Keep the approval after refresh for the demo.
      localStorage.setItem(
        'bys-approved-providers',
        JSON.stringify([
          ...JSON.parse(
            localStorage.getItem('bys-approved-providers') || '[]'
          ),
          selected
        ].filter((name, index, list) => list.indexOf(name) === index))
      );

      return updatedQueue;
    });

    setSelected(null);
  };

  const requestReview = () => {
    if (!selected) return;

    setQueue(currentQueue =>
      currentQueue.map(row =>
        row[0] === selected
          ? [row[0], row[1], row[2], row[3], 'review']
          : row
      )
    );

    setSelected(null);
  };

  return (
    <DashboardLayout type="admin">
      <main className="dashboard-content admin-content">

        <SectionTitle
          eyebrow={
            verification
              ? 'TRUST OPERATIONS · VERIFICATION QUEUE'
              : 'TRUST OPERATIONS · OVERVIEW'
          }
          title={
            verification ? (
              <>Review the people behind <em>the network.</em></>
            ) : (
              <>Trust at the speed of <em>scale.</em></>
            )
          }
          copy="Bharat Yatra Setu's operations layer makes trust and local economic impact visible."
          action={
            !verification && (
              <Button to="/admin/verification">
                Open verification queue
              </Button>
            )
          }
        />

        {!verification && (
          <div className="stats-grid admin-stats">
            <StatCard
              label="Verified providers"
              value="1,248"
              change="+96 this month"
              tone="trust"
            />
            <StatCard
              label="Active guides"
              value="842"
              change="67% of network"
            />
            <StatCard
              label="Bookings"
              value="8,492"
              change="+28% this month"
            />
            <StatCard
              label="Direct provider income"
              value="₹18.4L"
              change="₹0 platform commission"
              tone="earnings"
            />
            <StatCard
              label="Average trust score"
              value="92.4"
              change="+1.8 pts"
              tone="trust"
            />
          </div>
        )}

        <div className="admin-dashboard-grid">

          <div className="dashboard-panel admin-chart-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">NETWORK ACTIVITY</span>
                <h2>Bookings by city</h2>
              </div>

              <select>
                <option>Last 30 days</option>
              </select>
            </div>

            <div className="city-chart">
              {[
                ['Jaipur', 84],
                ['Jodhpur', 68],
                ['Udaipur', 56],
                ['Varanasi', 44],
                ['Hampi', 32]
              ].map(([city, value]) => (
                <div key={city}>
                  <span>{city}</span>
                  <div>
                    <i style={{ width: `${value}%` }} />
                  </div>
                  <b>{Math.round(value * 1.2)}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel pipeline-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">
                  VERIFICATION PIPELINE
                </span>
                <h2>Moving to trust.</h2>
              </div>

              <Link to="/admin/verification">
                Queue ↗
              </Link>
            </div>

            {[
              ['Documents received', '38', 'green'],
              ['Identity review', '12', 'amber'],
              ['Location check', '7', 'blue'],
              ['Approved this week', '24', 'green']
            ].map(([label, value, tone]) => (
              <div className="pipeline-row" key={label}>
                <span className={`pipeline-dot ${tone}`} />

                <div>
                  <b>{label}</b>
                  <small>providers</small>
                </div>

                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel verification-queue">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">
                PENDING PROVIDERS
              </span>
              <h2>Verification queue</h2>
            </div>

            <Link to="/admin/verification">
              Open full queue ↗
            </Link>
          </div>

          <div className="admin-table">

            <div className="table-row table-head">
              <span>Provider</span>
              <span>Type</span>
              <span>City</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>

            {queue.length === 0 ? (
              <div className="empty-state">
                <h3>All providers reviewed</h3>
                <p>
                  The verification queue is currently clear.
                </p>
              </div>
            ) : (
              queue.map(
                ([name, type, city, time, status]) => (
                  <button
                    className="table-row"
                    key={name}
                    onClick={() => setSelected(name)}
                  >
                    <span>
                      <b>{name}</b>
                      <small>
                        Provider ID · BYS-
                        {name.slice(0, 2).toUpperCase()}24
                      </small>
                    </span>

                    <span>{type}</span>
                    <span>{city}</span>
                    <span>{time}</span>

                    <Status
                      tone={
                        status === 'review'
                          ? 'blue'
                          : 'amber'
                      }
                    >
                      {status}
                    </Status>
                  </button>
                )
              )
            )}

          </div>
        </div>

        {selected && (
          <div className="modal-backdrop">

            <div className="modal">

              <button
                className="modal-close"
                onClick={() => setSelected(null)}
              >
                ×
              </button>

              <div className="eyebrow">
                VERIFICATION REVIEW
              </div>

              <h2>{selected}</h2>

              <p>
                Documents are ready for a reviewer.
                This is a simulated trust operations workflow.
              </p>

              <div className="review-actions">

                <button
                  type="button"
                  onClick={approveProvider}
                  style={{
                    width: '100%',
                    border: '0',
                    borderRadius: '4px',
                    padding: '16px 20px',
                    background: '#29365f',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Approve prototype ↗
                </button>

                <button
                  type="button"
                  onClick={requestReview}
                  style={{
                    width: '100%',
                    border: '1px solid #29365f',
                    borderRadius: '4px',
                    padding: '16px 20px',
                    background: '#fff',
                    color: '#29365f',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Request review ↗
                </button>

              </div>

            </div>

          </div>
        )}

      </main>
    </DashboardLayout>
  );
}