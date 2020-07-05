const modal = (id, addClass, setInput) => {
    const block = document.querySelector(id),
          areas = document.querySelectorAll('.area'),
          inputs = document.querySelectorAll('input')
    
    let set = setInput



    areas.forEach(area => {
        let values = area.querySelector('.values')
        let input = area.querySelector('input')
        let idInput = input.id
        input.value = set[idInput]
        values.textContent = input.value
    })

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            let idInput = input.id
            
            set[idInput] = +input.value
            input.nextElementSibling.textContent = input.value
        })
    })


    let isOpen = false

    block.style.marginTop = `${-block.offsetHeight}px`

    const openWind = () => {
        isOpen = true
        block.style.marginTop = '0px'
    }

    const closeWind = () => {
        isOpen = false
        let h = block.offsetHeight
        block.style.marginTop = `${-h}px`
    }

    openBtn.addEventListener('click', e => {
        e.preventDefault();

        if (!isOpen){
            openWind()
        }else {
            closeWind()
        }
    })

    return set
}

export default modal;