import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
// Removed 'useState' import as it's no longer needed for hover animation

export default function Hero() {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.user);
    const heroRef = useRef(null);
    const headerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);

    // No need for 'animateCreate' or 'animateExplore' state for hover animation

    const handleCreateCampaignClick = (e) => {
        e.preventDefault(); // Prevent default link behavior immediately

        if (!user) {
            toast.error('Please log in first to create a campaign.');
            navigate('/login');
            return;
        }
        if (loading) {
            toast.info('Loading user data, please wait...');
            return;
        }
        const kycStatus = user.kycStatus;
        if (kycStatus === 'Approved') {
            navigate("/create-campaign");
        } else if (kycStatus === 'Rejected') { // Corrected typo here
            toast.error('You are not a verified user. Please complete your KYC first.');
        } else if (kycStatus === 'Pending Review') {
            toast.info('Please wait for your KYC verification.');
        } else {
            toast.info('Please submit your KYC first to create a campaign.');
        }
    };

    const handleExploreCampaignsClick = (e) => {
        e.preventDefault(); // Prevent default link behavior immediately
        navigate("/explore");
    };

    useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })
      .fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.8')
      .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .fromTo(buttonsRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.2 }, '-=0.2');

    return () => {
        tl.kill();
    };
}, []);

return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center opacity-0">
        {/* Background Image with Overlay */}
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('/Images/hero.png')`,
            }}
        >
            <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Header overlay */}
        <div ref={headerRef} className="absolute top-0 left-0 w-full z-10">
            <Header hideHome={true} />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-6 text-center mt-16">
            <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 opacity-0 translate-y-10">
                <span className="block"><span className="text-[#B2C9AD]">Empower </span>
                    Dreams</span>
                <span className="block">
                    Through <span className="text-[#B2C9AD]">Support</span>
                </span>
            </h1>

            <p ref={subtitleRef} className="text-lg md:text-xl text-[#B2C9AD] mb-12 max-w-2xl mx-auto opacity-0 translate-y-10">
                Be a part of the breakthrough and make someone's dream come true.
            </p>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="/create-campaign" className="w-full sm:w-auto opacity-0 translate-y-10" onClick={handleCreateCampaignClick}>
                    <button className="btn w-full">
                        <i className="animation"></i>START A CAMPAIGN<i className="animation"></i>
                    </button>
                </a>
                <a href="/explore" className="w-full sm:w-auto opacity-0 translate-y-10" onClick={handleExploreCampaignsClick}>
                    <button className="btn w-full">
                        <i className="animation"></i>EXPLORE CAMPAIGNS<i className="animation"></i>
                    </button>
                </a>
            </div>
        </div>

        {/* Styles for the buttons */}
        <style jsx>{`
            .btn {
                outline: 0;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                background: #4A5D45;
                min-width: 200px;
                border: 0;
                border-radius: 100px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
                box-sizing: border-box;
                padding: 16px 20px;
                color: #fff;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1.2px;
                text-transform: uppercase;
                overflow: hidden;
                cursor: pointer;
                transition: opacity 0.3s;
            }

            .btn:hover {
                opacity: .95;
            }

            .btn:hover .animation {
                border-radius: 100%;
                animation: ripple 0.6s linear infinite;
            }

            .btn .animation {
                box-shadow: none;
                animation: none;
            }

            @keyframes ripple {
                0% {
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1);
                }

                100% {
                    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1), 0 0 0 80px rgba(255, 255, 255, 0);
                }
            }
        `}</style>
    </section>
);
}