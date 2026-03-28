// Painel Dinheiro Mudo - Logic

class AdSystem {
    constructor() {
        this.slots = JSON.parse(localStorage.getItem('dm_slots')) || this.initSlots();
        this.currentSlotIndex = 0;
        this.timer = null;
        this.progressTimer = null;
        this.startTime = 0;
        
        // UI Elements
        this.dashboard = document.getElementById('dashboard-view');
        this.player = document.getElementById('player-view');
        this.modal = document.getElementById('modal-editor');
        this.slotsContainer = document.getElementById('slots-container');
        this.progressFill = document.getElementById('progress-fill');
        
        this.init();
    }

    initSlots() {
        const slots = [];
        for (let i = 1; i <= 6; i++) {
            slots.push({
                id: i,
                active: false,
                image: null,
                duration: 10
            });
        }
        return slots;
    }

    saveSlots() {
        localStorage.setItem('dm_slots', JSON.stringify(this.slots));
    }

    init() {
        this.renderSlots();
        this.setupEventListeners();
    }

    renderSlots() {
        this.slotsContainer.innerHTML = '';
        this.slots.forEach(slot => {
            const card = document.createElement('div');
            card.className = `slot-card glass ${slot.active ? 'active' : ''}`;
            card.innerHTML = `
                <span class="slot-number">${slot.id}</span>
                <div class="slot-icon">${slot.active ? '✅' : '📷'}</div>
                <div style="font-size: 0.85rem; font-weight: 600;">${slot.active ? 'Slot Ativo' : 'Vazio'}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem;">
                    ${slot.active ? `${slot.duration}s` : 'Clique para configurar'}
                </div>
                ${slot.image ? `<img src="${slot.image}" style="width: 100%; height: 40px; object-fit: cover; border-radius: 4px; margin-top: 0.5rem; opacity: 0.5;">` : ''}
            `;
            card.onclick = () => this.openEditor(slot.id);
            this.slotsContainer.appendChild(card);
        });
    }

    openEditor(id) {
        const slot = this.slots.find(s => s.id === id);
        document.getElementById('edit-slot-id').value = id;
        document.getElementById('modal-title').innerText = `Slot de Anúncio ${id}`;
        document.getElementById('ad-duration').value = slot.duration;
        
        const preview = document.getElementById('preview-img');
        if (slot.image) {
            preview.src = slot.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
        
        this.modal.style.display = 'flex';
    }

    closeEditor() {
        this.modal.style.display = 'none';
        document.getElementById('form-edit').reset();
    }

    setupEventListeners() {
        // Modal buttons
        document.getElementById('btn-cancel').onclick = () => this.closeEditor();
        
        // Form submit
        document.getElementById('form-edit').onsubmit = (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-slot-id').value);
            const duration = parseInt(document.getElementById('ad-duration').value);
            const imageIn = document.getElementById('ad-image-input');
            
            const slot = this.slots.find(s => s.id === id);
            slot.duration = duration;
            
            if (imageIn.files && imageIn.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    slot.image = ev.target.result;
                    slot.active = true;
                    this.saveSlots();
                    this.renderSlots();
                    this.closeEditor();
                };
                reader.readAsDataURL(imageIn.files[0]);
            } else {
                if (slot.image) slot.active = true;
                this.saveSlots();
                this.renderSlots();
                this.closeEditor();
            }
        };

        // Player controls
        document.getElementById('btn-start-player').onclick = () => this.startPlayer();
        document.getElementById('btn-close-player').onclick = () => this.stopPlayer();
        
        // Player keyboard escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.player.style.display === 'block') {
                this.stopPlayer();
            }
        });

        // Script copy
        document.getElementById('btn-copy-script').onclick = () => {
            const script = `Fala, tudo bem? Vi seu negócio aqui perto e sou motorista de Uber. Tenho um tablet no meu carro onde passam anúncios locais o dia todo pros passageiros. Já tenho um dentista e uma barbearia, e queria te oferecer o último slot pra sua loja. Custa só R$150 por mês. Topa dar uma olhada em como fica?`;
            navigator.clipboard.writeText(script);
            alert('Script copiado! Mande agora no WhatsApp do lojista.');
        };
    }

    startPlayer() {
        const activeSlots = this.slots.filter(s => s.active && s.image);
        if (activeSlots.length === 0) {
            alert('Configure ao menos um slot com imagem antes de iniciar o painel.');
            return;
        }

        this.dashboard.style.display = 'none';
        this.player.style.display = 'block';
        
        // Try to go fullscreen
        if (this.player.requestFullscreen) {
            this.player.requestFullscreen().catch(err => console.log('Fullscreen failed'));
        }

        this.currentSlotIndex = 0;
        this.showNextAd();
    }

    stopPlayer() {
        clearTimeout(this.timer);
        cancelAnimationFrame(this.progressTimer);
        this.player.style.display = 'none';
        this.dashboard.style.display = 'block';
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    showNextAd() {
        const activeSlots = this.slots.filter(s => s.active && s.image);
        const currentSlot = activeSlots[this.currentSlotIndex];
        
        const container = document.getElementById('slides-container');
        container.innerHTML = `
            <div class="ad-slide active">
                <img src="${currentSlot.image}" alt="Ad">
            </div>
        `;

        this.startTime = Date.now();
        this.updateProgress(currentSlot.duration * 1000);

        this.timer = setTimeout(() => {
            this.currentSlotIndex = (this.currentSlotIndex + 1) % activeSlots.length;
            this.showNextAd();
        }, currentSlot.duration * 1000);
    }

    updateProgress(totalDuration) {
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        this.progressFill.style.width = `${progress}%`;

        if (progress < 100) {
            this.progressTimer = requestAnimationFrame(() => this.updateProgress(totalDuration));
        }
    }
}

// Initial Mock Content if empty
window.onload = () => {
    new AdSystem();
};
