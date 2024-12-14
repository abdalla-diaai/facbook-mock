const handleAlerts = (type, msg) => {
    alert.html(`
    <div class="alert alert-${type}" role="alert">
        ${msg}
    </div>
        `)
}