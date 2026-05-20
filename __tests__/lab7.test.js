describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    expect(numProducts).toBe(20);
  });

  // STEP 1: check that EVERY product-item has title, price, image populated
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    let allArePopulated = true;
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => item.data);
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const v = prodItemsData[i];
      if (!v.title || v.title.length === 0) allArePopulated = false;
      if (!v.price && v.price !== 0) allArePopulated = false;
      if (!v.image || v.image.length === 0) allArePopulated = false;
    }

    expect(allArePopulated).toBe(true);
  }, 10000);

  // STEP 2: click first item's button, verify text swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const firstItem = await page.$('product-item');
    const shadowRoot = await firstItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    await button.click();
    const innerText = await (await button.getProperty('innerText')).jsonValue();

    expect(innerText).toBe('Remove from Cart');
  }, 2500);

  // STEP 3: click "Add to Cart" on all items, verify cart-count is 20
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text === 'Add to Cart') {
        await button.click();
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  // STEP 4: reload, verify all buttons say "Remove from Cart" and cart-count is 20
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    let allRemove = true;
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Remove from Cart') allRemove = false;
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(allRemove).toBe(true);
    expect(cartCount).toBe('20');
  }, 10000);

  // STEP 5: localStorage.cart should be '[1,2,...,20]'
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // STEP 6: click "Remove from Cart" on all items, verify cart-count is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text === 'Remove from Cart') {
        await button.click();
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

  // STEP 7: reload, verify all buttons say "Add to Cart" and cart-count is 0
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    let allAdd = true;
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Add to Cart') allAdd = false;
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(allAdd).toBe(true);
    expect(cartCount).toBe('0');
  }, 10000);

  // STEP 8: localStorage.cart should be '[]'
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
