const background = {
    init: () => {
        const canvas = document.getElementById('background-canvas');
        const ctx = canvas.getContext('2d');

        let numbers = [];
        const maxNumbers = 20;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            numbers = [];
            for (let i = 0; i < maxNumbers; i++) {
                numbers.push(background.createNumber());
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.body.classList.contains('dark-theme');
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

            numbers.forEach(number => {
                ctx.save();
                ctx.translate(number.x, number.y);
                ctx.rotate(number.angle);
                ctx.font = `${number.size}pt 'Courier New', monospace`;
                ctx.globalAlpha = number.opacity;
                ctx.filter = `blur(${number.blur}px)`;
                ctx.fillText(number.text, 0, 0);
                ctx.restore();

                background.updateNumber(number);
            });

            requestAnimationFrame(animate);
        };

        animate();
    },

    createNumber: () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        return {
            text: '+' + Math.random().toString().substring(2, 2 + Math.floor(Math.random() * 6) + 5),
            x: Math.random() * screenWidth,
            y: Math.random() * screenHeight,
            size: Math.random() * 20 + 30, // 30pt to 50pt
            angle: (Math.PI / 180) * 45,
            opacity: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
            blur: Math.random() * 2 + 1, // 1px to 3px
            speed: Math.random() * 0.5 + 0.2, // 0.2 to 0.7
            blink: Math.random() > 0.95,
        };
    },

    updateNumber: (number) => {
        number.y -= number.speed;
        if (number.y < -number.size) {
            Object.assign(number, background.createNumber(), { y: window.innerHeight + number.size });
        }

        if (number.blink) {
            number.opacity = Math.random() * 0.3 + 0.1;
        }
    },
};

background.init();
