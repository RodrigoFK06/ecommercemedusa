const seconds = process.argv[2] || 5;
console.log(`Esperando ${seconds} segundos...`);
setTimeout(() => {}, seconds * 1000);
