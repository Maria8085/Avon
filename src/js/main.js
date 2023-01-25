//= swiper.js

const breakpointWidthMobile = 699;
const breakpointWidthPlanshet = 1019;

const chunk = (arr, max) => {
	const size = Math.min(max, Math.ceil(arr.length / 2));
	return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
		arr.slice(i * size, i * size + size)
	);
};

const initSliders = () => {
	let sliderInstances = [];
	let isMobile = false;
	const sliders = document.querySelectorAll(".tmpl_hh_slider");

	const slidesPerView = {
		desktop: 3,
		mobile: 1,
	};

	const desktopConfig = {
		direction: "vertical",
		slidesPerView: 1,
		speed: 800,
		mousewheel: {
			releaseOnEdges: true,
		},
	};

	const mobileConfig = {
		spaceBetween: 20,
		autoHeight: true,
	};

	const init = () => {
		sliders.forEach((slider) => {
			const container = slider.querySelector(".swiper-container");
			const scrollbar = slider.querySelector(".swiper-scrollbar");
			const slides = slider.querySelectorAll(".tmpl_hh_hidden_slides > div");

			const { mobile: slidesPerViewMobile, desktop: slidesPerViewDesktop } =
				slidesPerView;

			const chunkedSlides = chunk(
				[...slides],
				isMobile ? slidesPerViewMobile : slidesPerViewDesktop
			);

			const config = isMobile ? mobileConfig : desktopConfig;

			const instance = new Swiper(container, {
				...config,
				scrollbar: {
					dragSize: 35,
					el: scrollbar,
					draggable: true,
					hide: false,
					verticalClass: "swiper-scrollbar-vertical",
				},
			});

			instance.scrollbar.updateSize();

			chunkedSlides.forEach((chunked, index) => {
				const slideContent = [...chunked].map((elem) => `${elem.outerHTML}`);

				instance.appendSlide(
					`<div class="swiper-slide tmpl_hh_slide--${
						index + 1
					}">${slideContent.join("")}</div>`
				);
			});

			setTimeout(() => {
				instance.update();
			}, 1);

			sliderInstances.push(instance);
		});
	};

	const destroy = () => {
		sliderInstances.forEach((s) => {
			s.removeAllSlides();
			s.destroy(true, true);
		});
		sliderInstances = [];
	};

	const reInitAllSliders = () => {
		destroy();
		init();
	};

	init();

	const resize = () => {
		const { clientWidth } = document.body;

		if (clientWidth <= breakpointWidthPlanshet) {
			if (!isMobile) {
				isMobile = true;
				reInitAllSliders();
			}
		} else {
			if (isMobile) {
				isMobile = false;
				reInitAllSliders();
			}
		}
	};

	window.addEventListener("resize", resize);
	resize();
};

const initVideoPreview = () => {
	const videos = document.querySelectorAll(".tmpl_hh_video");

	videos.forEach((video) => {
		const content = video.querySelector(".tmpl_hh_video__content");
		const id = video.dataset.id;

		content.addEventListener("click", () => {
			video.innerHTML =
				'<iframe src="https://www.youtube.com/embed/' +
				id +
				'?rel=0&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			const iframe = video.querySelector("iframe");

			if (iframe !== null) {
				iframe.addEventListener("load", function () {
					setTimeout(() => {
						iframe.contentWindow.postMessage(
							'{"event":"command","func":"' + "playVideo" + '","args":""}',
							"*"
						);
					}, 100);
				});
			}
		});
	});
};

function DOM_HH_Ready() {
	initSliders();
	initVideoPreview();

	const scrollToVacancies = () => {
		const vacancyBlock = document.querySelector(".tmpl_hh_vacancy_block");
		if (vacancyBlock !== null)
			vacancyBlock.scrollIntoView({ behavior: "smooth" });
	};

	const initScrollToVacancies = () => {
		const buttons = document.querySelectorAll(".tmpl_hh_button--vacancy");

		buttons.forEach((button) =>
			button.addEventListener("click", (e) => {
				e.preventDefault();
				scrollToVacancies();
			})
		);
	};

	initScrollToVacancies();
	video();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", DOM_HH_Ready);
} else {
	DOM_HH_Ready();
}
