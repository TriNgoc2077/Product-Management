const ShareProductDialog = {
    dialogElement: null,
    
    init() {
      // Create dialog element if not exists
      if (!this.dialogElement) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
          <div class="share-dialog-content">
            <div class="share-dialog-header">
              <h3>Share Product</h3>
              <button class="close-button">&times;</button>
            </div>
            <div class="share-dialog-body">
              <div class="share-url-container">
                <input type="text" class="share-url-input" readonly>
                <button class="copy-button">Copy</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(dialog);
        this.dialogElement = dialog;
        
        // Add event listeners
        const closeBtn = dialog.querySelector('.close-button');
        closeBtn.addEventListener('click', () => this.close());
        
        const copyBtn = dialog.querySelector('.copy-button');
        copyBtn.addEventListener('click', () => this.copyUrl());
        
        // Close when clicking outside
        dialog.addEventListener('click', (e) => {
          if (e.target === dialog) {
            this.close();
          }
        });
      }
    },
    
    open(productSlug) {
      const fullUrl = window.location.origin + `/products/detail/${productSlug}`;
      this.dialogElement.querySelector('.share-url-input').value = fullUrl;
      this.dialogElement.style.display = 'flex';
    },
    
    close() {
      this.dialogElement.style.display = 'none';
    },
    
    async copyUrl() {
      const input = this.dialogElement.querySelector('.share-url-input');
      const copyBtn = this.dialogElement.querySelector('.copy-button');
      
      try {
        await navigator.clipboard.writeText(input.value);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };