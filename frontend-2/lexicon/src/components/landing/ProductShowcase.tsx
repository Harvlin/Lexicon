import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Assets — make sure these exist in src/assets
import imgAiChatTutor from '@/assets/aiChatTutor.png';
import imgFlashcards from '@/assets/flashcard.png';
import imgPersonalizedSchedule from '@/assets/personalizedSchedule.png';
import imgProgressAnalytics from '@/assets/progressAnalytic.png';

type CardProps = {
	title: string;
	desc: string;
	img: string;
	y?: any; // MotionValue<number>
	className?: string;
	z?: number;
	float?: boolean;
	floatDelay?: number;
	widthClass?: string; // e.g., w-[58%]
};

export function ProductShowcaseSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

	// Parallax offsets (smaller for subtlety)
	const yMain = useTransform(scrollYProgress, [0, 1], [30, -30]);
	const yA = useTransform(scrollYProgress, [0, 1], [20, -15]);
	const yB = useTransform(scrollYProgress, [0, 1], [26, -18]);
	const yC = useTransform(scrollYProgress, [0, 1], [18, -12]);

	// Section heading variants
	const headingInitial = { opacity: 0, y: 24 };
	const headingAnimate = { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } };

	return (
		<section ref={sectionRef} id="showcase" className="relative py-28 md:py-36 overflow-hidden">
			{/* Background ornaments */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
				<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
			</div>

			<div className="container mx-auto px-4 lg:px-8">
				<motion.div initial={headingInitial} whileInView={headingAnimate} viewport={{ once: true }} className="text-center mb-14 md:mb-20 space-y-4">
					<span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">Product Showcase</span>
					<h2 className="text-4xl md:text-5xl font-heading font-bold">
						See it in action
					</h2>
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
						A clean, immersive preview of the core experiences — crafted to be clear and delightful.
					</p>
				</motion.div>

				{/* Collage canvas: absolute positions on md+, stacked on small screens */}
				<div className="relative max-w-7xl mx-auto">
					{/* Mobile/Small: stack */}
					<div className="md:hidden grid grid-cols-1 gap-6">
						<CollageCard title="AI Chat Tutor" desc="Context-aware explanations with citations." img={imgAiChatTutor} z={30} />
						<CollageCard title="Smart Flashcards" desc="Auto-generated spaced repetition." img={imgFlashcards} z={20} />
						<CollageCard title="Personalized Schedule" desc="Sessions adapt to your mastery." img={imgPersonalizedSchedule} z={10} />
						<CollageCard title="Progress Analytics" desc="Retention curves and insights." img={imgProgressAnalytics} z={40} />
					</div>

					{/* Desktop: floating collage */}
					<div className="hidden md:block relative h-[960px]">
						{/* Main hero (left/center) */}
						<CollageCard
							title="AI Chat Tutor"
							desc="Context-aware explanations with citations."
							img={imgAiChatTutor}
							y={yMain}
							z={30}
							float={!reduceMotion}
							widthClass="w-[58%]"
							className="absolute left-0 top-20"
						/>

						{/* Top-right */}
						<CollageCard
							title="Smart Flashcards"
							desc="Spaced repetition that writes itself."
							img={imgFlashcards}
							y={yA}
							z={20}
							float={!reduceMotion}
							floatDelay={0.2}
							widthClass="w-[34%]"
							className="absolute right-2 top-0"
						/>

						{/* Mid-right */}
						<CollageCard
							title="Progress Analytics"
							desc="Retention curves & session quality."
							img={imgProgressAnalytics}
							y={yB}
							z={40}
							float={!reduceMotion}
							floatDelay={0.4}
							widthClass="w-[36%]"
							className="absolute right-0 top-[340px]"
						/>

						{/* Bottom-left overlay */}
						<CollageCard
							title="Personalized Schedule"
							desc="Plan that evolves with you."
							img={imgPersonalizedSchedule}
							y={yC}
							z={35}
							float={!reduceMotion}
							floatDelay={0.6}
							widthClass="w-[42%]"
							className="absolute left-[14%] bottom-0"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function CollageCard({ title, desc, img, y, className, z = 10, float, floatDelay = 0, widthClass = 'w-full' }: CardProps) {
	const reduceMotion = useReducedMotion();

	// Hover tilt effect via CSS variables
	const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		const rect = el.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width; // 0..1
		const py = (e.clientY - rect.top) / rect.height; // 0..1
		const max = 6; // degrees
		const ry = (px - 0.5) * (max * 2);
		const rx = -(py - 0.5) * (max * 2);
		el.style.setProperty('--rx', `${rx}deg`);
		el.style.setProperty('--ry', `${ry}deg`);
	};
	const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		el.style.setProperty('--rx', `0deg`);
		el.style.setProperty('--ry', `0deg`);
	};

	return (
		<motion.div
			style={{ y, rotateX: 'var(--rx, 0deg)', rotateY: 'var(--ry, 0deg)', zIndex: z }}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.35 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			animate={float && !reduceMotion ? { y: [0, -8, 0, 8, 0] } : undefined}
			// @ts-ignore
			transitionOverride={float && !reduceMotion ? { duration: 7 + (floatDelay || 0), repeat: Infinity, ease: 'easeInOut' } : undefined}
			className={`${className ?? ''} ${widthClass} group`}
		>
			{/* Glow */}
			<div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity" />

			{/* Card */}
							<div className="relative overflow-hidden rounded-3xl shadow-elevated group-hover:shadow-2xl border border-border/60 bg-card aspect-[16/9] flex items-center justify-center">
								{/* Image wrapper flush to the frame (no inner gap) */}
								<div className="absolute inset-0">
									<img
										src={img}
										alt={title}
										className="w-full h-full object-contain rounded-[inherit] select-none pointer-events-none"
									/>
								</div>

				{/* Label overlay (hover reveal) */}
				<div className="relative z-10 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-5">
					<h3 className="text-base md:text-lg font-semibold">{title}</h3>
					<p className="text-xs md:text-sm text-muted-foreground mt-1">{desc}</p>
				</div>
			</div>
		</motion.div>
	);
}

export default ProductShowcaseSection;
