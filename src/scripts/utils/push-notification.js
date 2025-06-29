const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

let swRegistration = null;
let isSubscribed = false;

export async function updatePushButton(buttonElement) {
  if (!('serviceWorker' in navigator)) {
    buttonElement.textContent = 'Push Not Supported';
    buttonElement.disabled = true;
    return;
  }

  swRegistration = await navigator.serviceWorker.ready;
  const subscription = await swRegistration.pushManager.getSubscription();
  isSubscribed = subscription !== null;

  buttonElement.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe';
}

export async function handlePushButtonClick(buttonElement, token) {
  if (!swRegistration) {
    swRegistration = await navigator.serviceWorker.ready;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi tidak diberikan.');
    return;
  }

  if (isSubscribed) {
    await unsubscribeUser(token);
  } else {
    await subscribeUser(token);
  }

  await updatePushButton(buttonElement);
}

async function subscribeUser(token) {
  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const { endpoint, keys } = subscription.toJSON();

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      }),
    });

    isSubscribed = true;
    alert('Berhasil subscribe notifikasi!');
    console.log('✅ Berhasil subscribe notifikasi.');
  } catch (err) {
    alert('Gagal subscribe notifikasi.');
    console.error('❌ Gagal subscribe:', err);
  }
} // ✅ Ditutup dengan benar!

async function unsubscribeUser(token) {
  try {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (!subscription) return;

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    await subscription.unsubscribe();
    isSubscribed = false;
    alert('Berhasil unsubscribe notifikasi!');
    console.log('✅ Berhasil unsubscribe notifikasi.');
  } catch (err) {
    alert('Gagal unsubscribe notifikasi.');
    console.error('❌ Gagal unsubscribe:', err);
  }
}
