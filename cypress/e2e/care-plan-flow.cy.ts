describe('Care Plan Creation Flow', () => {
  beforeEach(() => {
    cy.visit('/care-plan/new');
  });

  it('completes full care plan creation flow', () => {
    // Step 1: Basic Info
    cy.get('input[placeholder*="Plan başlığı"]').type('Test Bakım Planı');
    cy.get('textarea[placeholder*="Plan açıklaması"]').type('Test açıklaması');
    cy.get('button').contains('Devam Et').click();

    // Step 2: Medications
    cy.get('input[placeholder*="İlaç adı"]').type('Test İlaç');
    cy.get('input[type="number"]').first().type('100');
    cy.get('select').first().select('mg');
    cy.get('select').eq(1).select('daily');
    cy.get('button').contains('Devam Et').click();

    // Step 3: Appointments
    cy.get('input[placeholder*="Randevu başlığı"]').type('Test Randevu');
    cy.get('select').first().select('checkup');
    cy.get('input[type="datetime-local"]').type('2024-12-31T10:00');
    cy.get('button').contains('Devam Et').click();

    // Step 4: Health Goals
    cy.get('input[placeholder*="Hedef başlığı"]').type('Test Hedef');
    cy.get('textarea[placeholder*="Hedef açıklaması"]').type('Test hedef açıklaması');
    cy.get('select').first().select('weight');
    cy.get('input[type="date"]').type('2024-12-31');
    cy.get('button').contains('Devam Et').click();

    // Step 5: Health Metrics
    cy.get('input[placeholder*="Kan Şekeri"]').type('Kan Şekeri');
    cy.get('select').first().select('number');
    cy.get('input[placeholder*="mg/dL"]').type('mg/dL');
    cy.get('button').contains('Devam Et').click();

    // Step 6: Review & Export
    // Plan özeti kontrolü
    cy.get('h3').contains('Bakım Planı Özeti').should('be.visible');
    cy.get('dd').contains('Test Bakım Planı').should('be.visible');
    cy.get('dd').contains('Test İlaç').should('be.visible');
    cy.get('dd').contains('Test Hedef').should('be.visible');
    cy.get('dd').contains('Kan Şekeri').should('be.visible');

    // Eksik alan kontrolü
    cy.get('div').contains('Eksik Bilgiler').should('not.exist');

    // Export işlemleri
    cy.get('button').contains('PDF Dosyası').click();
    cy.get('[role="alert"]')
      .contains('Plan başarıyla dışa aktarıldı')
      .should('be.visible');

    cy.get('button').contains('CSV Dosyası').click();
    cy.get('[role="alert"]')
      .contains('Plan başarıyla dışa aktarıldı')
      .should('be.visible');

    cy.get('button').contains('iCal Takvimi').click();
    cy.get('[role="alert"]')
      .contains('Plan başarıyla dışa aktarıldı')
      .should('be.visible');

    // Paylaşım linki
    cy.get('button').contains('Paylaşım Linki Oluştur').click();
    cy.get('[role="alert"]')
      .contains('Paylaşım linki kopyalandı')
      .should('be.visible');

    // Plan tamamlama
    cy.get('button').contains('Planı Tamamla').click();

    // Başarı kontrolü
    cy.get('[role="alert"]')
      .contains('Bakım planı başarıyla oluşturuldu')
      .should('be.visible');
  });

  it('validates required fields in each step', () => {
    // Try to proceed without filling required fields
    cy.get('button').contains('Devam Et').click();
    cy.get('[role="alert"]').should('be.visible');

    // Fill required field and proceed
    cy.get('input[placeholder*="Plan başlığı"]').type('Test Plan');
    cy.get('button').contains('Devam Et').click();

    // Verify navigation to next step
    cy.get('div').contains('İlaç tedavisi planlaması').should('be.visible');
  });

  it('persists data when navigating between steps', () => {
    // Fill basic info
    const planTitle = 'Test Persistence Plan';
    cy.get('input[placeholder*="Plan başlığı"]').type(planTitle);
    cy.get('button').contains('Devam Et').click();

    // Go back
    cy.get('button').contains('Geri').click();

    // Verify data persists
    cy.get('input[placeholder*="Plan başlığı"]').should('have.value', planTitle);
  });

  it('handles form submission errors gracefully', () => {
    // Intercept API call and force error
    cy.intercept('POST', '/api/care-plans', {
      statusCode: 500,
      body: { error: 'Server error' },
    });

    // Fill minimum required data and try to complete
    cy.get('input[placeholder*="Plan başlığı"]').type('Error Test Plan');
    cy.get('button').contains('Devam Et').click();

    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      cy.get('button').contains('Devam Et').click();
    }

    // Try to complete
    cy.get('button').contains('Planı Tamamla').click();

    // Verify error handling
    cy.get('[role="alert"]').should('contain', 'Hata');
  });

  it('supports responsive layout', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get('.max-w-7xl').should('be.visible');
    cy.get('.px-4').should('be.visible');

    // Test tablet view
    cy.viewport('ipad-2');
    cy.get('.max-w-7xl').should('be.visible');

    // Test desktop view
    cy.viewport(1920, 1080);
    cy.get('.max-w-7xl').should('be.visible');
  });

  it('maintains accessibility standards', () => {
    // Check for ARIA labels
    cy.get('[aria-label]').should('have.length.at.least', 1);
    cy.get('[role="button"]').should('be.visible');
    cy.get('[role="alert"]').should('not.exist');

    // Check focus management
    cy.get('input').first().focus().should('have.focus');
    cy.get('input').should('have.focus');

    // Check color contrast (requires cypress-axe)
    cy.injectAxe();
    cy.checkA11y();
  });

  // Review Step özel testleri
  describe('Review Step', () => {
    beforeEach(() => {
      // Tüm adımları tamamla ve Review adımına gel
      cy.get('input[placeholder*="Plan başlığı"]').type('Test Bakım Planı');
      cy.get('button').contains('Devam Et').click();

      cy.get('input[placeholder*="İlaç adı"]').type('Test İlaç');
      cy.get('input[type="number"]').first().type('100');
      cy.get('select').first().select('mg');
      cy.get('button').contains('Devam Et').click();

      cy.get('input[placeholder*="Randevu başlığı"]').type('Test Randevu');
      cy.get('button').contains('Devam Et').click();

      cy.get('input[placeholder*="Hedef başlığı"]').type('Test Hedef');
      cy.get('button').contains('Devam Et').click();

      cy.get('input[placeholder*="Kan Şekeri"]').type('Kan Şekeri');
      cy.get('button').contains('Devam Et').click();
    });

    it('validates export functionality', () => {
      // PDF export
      cy.get('button').contains('PDF Dosyası').click();
      cy.get('[role="alert"]')
        .contains('Plan başarıyla dışa aktarıldı')
        .should('be.visible');

      // CSV export
      cy.get('button').contains('CSV Dosyası').click();
      cy.get('[role="alert"]')
        .contains('Plan başarıyla dışa aktarıldı')
        .should('be.visible');

      // iCal export
      cy.get('button').contains('iCal Takvimi').click();
      cy.get('[role="alert"]')
        .contains('Plan başarıyla dışa aktarıldı')
        .should('be.visible');
    });

    it('validates share functionality', () => {
      cy.get('button').contains('Paylaşım Linki Oluştur').click();
      cy.get('[role="alert"]')
        .contains('Paylaşım linki kopyalandı')
        .should('be.visible');
    });

    it('handles export errors gracefully', () => {
      // Mock failed export
      cy.intercept('POST', '/api/export/pdf', {
        statusCode: 500,
        body: { error: 'Export failed' },
      });

      cy.get('button').contains('PDF Dosyası').click();
      cy.get('[role="alert"]')
        .contains('Dışa aktarma sırasında bir hata oluştu')
        .should('be.visible');
    });

    it('handles share errors gracefully', () => {
      // Mock failed share
      cy.intercept('POST', '/api/share', {
        statusCode: 500,
        body: { error: 'Share failed' },
      });

      cy.get('button').contains('Paylaşım Linki Oluştur').click();
      cy.get('[role="alert"]')
        .contains('Link oluşturulurken bir hata oluştu')
        .should('be.visible');
    });

    it('maintains accessibility in export options', () => {
      // Export butonları için ARIA kontrolleri
      cy.get('button').contains('PDF Dosyası').should('have.attr', 'type', 'button');
      cy.get('button')
        .contains('CSV Dosyası')
        .should('have.attr', 'type', 'button');
      cy.get('button')
        .contains('iCal Takvimi')
        .should('have.attr', 'type', 'button');

      // Paylaşım butonu için ARIA kontrolleri
      cy.get('button')
        .contains('Paylaşım Linki Oluştur')
        .should('have.attr', 'type', 'button');

      // Loading states için ARIA kontrolleri
      cy.get('button').contains('PDF Dosyası').click();
      cy.get('button')
        .contains('PDF Dosyası')
        .should('have.attr', 'disabled');
    });
  });
}); 