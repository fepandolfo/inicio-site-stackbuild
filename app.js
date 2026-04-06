const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu a');

if (menuToggle && menu) {
	menuToggle.addEventListener('click', () => {
		const isOpen = menu.classList.toggle('open');
		menuToggle.setAttribute('aria-expanded', String(isOpen));
	});

	menuLinks.forEach((link) => {
		link.addEventListener('click', () => {
			menu.classList.remove('open');
			menuToggle.setAttribute('aria-expanded', 'false');
		});
	});
}

const revealElements = document.querySelectorAll('.section-reveal');

const revealObserver = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;

			entry.target.classList.add('visible');
			observer.unobserve(entry.target);
		});
	},
	{
		threshold: 0.16,
		rootMargin: '0px 0px -50px 0px'
	}
);

revealElements.forEach((el) => revealObserver.observe(el));
