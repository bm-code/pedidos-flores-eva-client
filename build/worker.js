console.log('Service worker');

self.addEventListener('push', async e => {
    const data = e.data.json();
    console.log(data);
    await self.registration.showNotification(data.title, {
        body: data.message,
        icon: '../src/assets/logo.svg'
    })
})