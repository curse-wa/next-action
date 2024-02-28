//if youre looking for some fancy framework, look elsewhere. this is quick and dirty

const actions_element = document.querySelector('#actions'),
      init_element    = document.querySelector('#initaction'),
      errToast        = new bootstrap.Toast(document.querySelector('#errorToast')),
      errText         = document.querySelector('#errorToast .toast-body .text'),
      registermodal   = new bootstrap.Modal('#exportModalFullscreen'),
      exportmodal     = document.querySelector('#exportModalFullscreen'),
      exportarea      = exportmodal.querySelector('.export-area'),
      shareurl        = exportmodal.querySelector('.share-url'),
      whTooltips      = {colorLinks: true, iconizeLinks: false, renameLinks: true},

addTrigger = (type,vals,actions=[[]]) => {
    let template = document.querySelector('#template .trigger')
    let clone = template.cloneNode(true)

    if(type) clone.querySelector('.trigger-select').value = type;
    triggerTypeChange(clone.querySelector('.trigger-select'))

    if(vals) vals.forEach(val => {
        clone.querySelector(`[name='${val[0]}']`).value = val[1];
    })

    actions_element.appendChild(clone)

    actions.forEach(a => {
        let actiontemp = document.querySelector('#template .action-pill')
        let action = actiontemp.cloneNode(true)
        clone.querySelector('.action-pills').appendChild(action)
        if(a[0]) action.querySelector('.action-type').value = a[0]
        if(a[1]) action.querySelector('.action-id').value = a[1]
        actionChange(action)
        updateActionPreview(action)
    })
    
    let tooltipTriggerList = clone.querySelectorAll('[data-bs-toggle="tooltip"]')
    let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    updateTriggerPreview(clone)
},

initOnLoad = () => {
    let template = document.querySelector('#template .trigger')
    let clone = template.cloneNode(true)

    let inittemp = document.querySelector('#template .load')
    let init = inittemp.cloneNode(true)

    let actiontemp = document.querySelector('#template .action-pill')
    let action = actiontemp.cloneNode(true)

    init_element.appendChild(clone)
    clone.querySelector('.row').insertAdjacentHTML('beforeend', init.innerHTML);
    clone.querySelector('.keep').remove()
    
    clone.querySelector('.action-pills').appendChild(action)
    updateActionPreview(action)

    let tooltipTriggerList = clone.querySelectorAll('[data-bs-toggle="tooltip"]')
    let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
},

confirmDelete = (el,del) => {
    if(del === true){
        el.closest('.trigger').remove()
    }else if(del === false){
        el.closest('.trigger').classList.remove('border','border-danger')
        el.closest('.card-footer').classList.remove('border-danger')
        el.closest('.card-footer').querySelector('.previews').style.display = 'block';
        el.closest('.card-footer').querySelector('.trigger-delete').style.display = 'none';
    }else{
        if(el.querySelector('.trigger-select')){
            el.classList.add('border','border-danger')
            el.querySelector('.card-footer').classList.add('border-danger')
            el.querySelector('.card-footer .previews').style.display = 'none';
            el.querySelector('.card-footer .trigger-delete').style.display = 'block';
        }
    }
},

triggerTypeChange = (el) => {
    let row = el.closest('.row');
    let selector = el.value == 'NPC Death'?'#template .npcdeath':'#template .encounter';
    let inittemp = document.querySelector(selector);
    let init = inittemp.cloneNode(true);
    [...row.querySelectorAll('.col:not(.keep)')].forEach(e=>e.remove());
    row.insertAdjacentHTML('beforeend', init.innerHTML);
    
    let tooltipTriggerList = row.querySelectorAll('[data-bs-toggle="tooltip"]')
    let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    updateTriggerPreview(el)
},

actionAdd = (el,action) => {
    let template = document.querySelector('#template .action-pill')
    let clone = template.cloneNode(true)
    el.closest('.card-body').querySelector('.action-pills').appendChild(clone)

    if(action){
        if(action[0]) clone.querySelector('.action-type').value = action[0]
        if(action[1]) clone.querySelector('.action-id').value = action[1]
    }

    updateAllActionSelect()
    if(action) actionChange(clone);
    else updateActionPreview(clone);
},

actionChange = (el) => {
    let pill = el.closest('.action-pill')

    if(el.value == 'delete'){
        pill.dataset.icon = "";
        updateActionPreview(pill,true);
        return;
    }

    let action_type = pill.querySelector('.action-type').value;
    let action_id = pill.querySelector('.action-id').value;
    
    if(!action_id) return;

    fetch(`https://nether.wowhead.com/tooltip/${action_type}/${action_id}?dataEnv=4&locale=0`)
        .then((response) => {if(response.ok) {return response.json()}})
        .then((data) => {
            pill.dataset.icon = data.icon || "";
            updateActionPreview(pill)
        }).catch((err)=>{
            pill.dataset.icon = "";
            updateActionPreview(pill)
        })
},

updateActionPreview = (pill,del) => {
    let actionPreview = pill.closest('.trigger').querySelector('.action-preview');
    let pill_container = pill.closest('.action-pills');
    if(del) pill.remove()
    let pills = [...pill_container.querySelectorAll('.action-pill')];
    let output = '';
    pills.forEach(p => {
        output += `<div class="action-icon" style="background-image:url(https://wow.zamimg.com/images/wow/icons/large/${p.dataset.icon||'inv_misc_questionmark'}.jpg)"></div>`
    })
    if(output.length) actionPreview.innerHTML = output;
    else actionPreview.innerHTML = 'no actions to preview';
    updateAllActionSelect()
},

updateTriggerPreview = (el) => {
    let trigger = el.closest('.trigger');
    let triggerPreview = trigger.querySelector('.trigger-preview');
    let triggerType = trigger.querySelector('.trigger-select');
    let output = ''
    if(triggerType){
        if(triggerType.value == 'Encounter Start' || triggerType.value == 'Encounter End'){
            let encounter = trigger.querySelector(`select[name='encounter']`)
            let text = encounter.options[encounter.selectedIndex].innerText
            let event = triggerType.value.includes('End')?'END':'START';
            if(encounter.value){
                output = `Triggers upon ${text} ENCOUNTER_${event} event`;  
            }
        }else{
            let npc = trigger.querySelector(`input[name='npc']`).value
            let kills = trigger.querySelector(`input[name='kills']`).value
            if(npc && kills && kills>0){
                output = `Triggers after ${kills} <a href="https://www.wowhead.com/classic/npc=${npc}" target="_blank" data-wh-rename-link="true">${npc}</a> UNIT_DIED events`; 
            }
        }
        triggerPreview.innerHTML = output
        if(!imp) $WowheadPower.refreshLinks()
    }
},

updateAllActionSelect = () => {
    [...document.querySelectorAll('.action-pills')].forEach(group => {
        let all = [...group.querySelectorAll('.action-pill')];
        all.forEach(el => {
            el.querySelector('select').options[2].hidden = all.length<2
            el.querySelector('select').options[3].hidden = all.length<2
        })
    })
},

readyExportText = () => {
    
    let triggers = [...document.querySelectorAll('main .trigger')];
    let output = '';
    let errors = false;

    triggers.forEach((trigger,index,arr) => {
        let trigger_type = trigger.querySelector('.trigger-select');
        let actions = [...trigger.querySelectorAll('.action-pill')];
        actions = actions.map(pill => {
            let action_type = pill.querySelector('.action-type').value;
            let action_id = pill.querySelector('.action-id').value;
            return action_type+':'+(action_id||0)
        })

        if(!trigger_type){
            let desc = trigger.querySelector(`input[name='desc']`).value.replace(/,/gi,'')
            output+=`0,0,"${desc||''}",${actions.join(',')}`;
        }else if(trigger_type.value=='Encounter Start'){
            let encounter = trigger.querySelector(`select[name='encounter']`).value
            if(!encounter){
                errText.innerHTML = 'Missing encounter selection'
                errToast.show()
                errors = true
            }
            let desc = trigger.querySelector(`input[name='desc']`).value.replace(/,/gi,'')
            output+=`ENCOUNTER_START,${encounter},"${desc||''}",${actions.join(',')}`;
        }else if(trigger_type.value=='Encounter End'){
            let encounter = trigger.querySelector(`select[name='encounter']`).value
            if(!encounter){
                errText.innerHTML = 'Missing encounter selection'
                errToast.show()
                errors = true
            }
            let desc = trigger.querySelector(`input[name='desc']`).value.replace(/,/gi,'')
            output+=`ENCOUNTER_END,${encounter},"${desc||''}",${actions.join(',')}`;
        }else{
            let npc = trigger.querySelector(`input[name='npc']`).value
            let kills = trigger.querySelector(`input[name='kills']`).value
            if(!npc || !kills || kills==0){
                errText.innerHTML = 'Missing NPC ID and/or #kills'
                errToast.show()
                errors = true
            }
            let desc = trigger.querySelector(`input[name='desc']`).value.replace(/,/gi,'')
            output+=`${npc},${kills},"${desc||''}",${actions.join(',')}`;
        }

        if(index !== arr.length-1) output+='\n';
    })

    if(!errors){
        exportarea.value = output
        shareurl.value = insertUrlParam('i',btoa(output))
        errToast.hide()
        registermodal.show()
        document.querySelector('html').style.overflow = 'hidden';
    }
},

importText = (imp) => {
    let text = imp || exportarea.value;
    let lines = text.split(/\r?\n|\r|\n/g);
    lines = lines.filter(line => /^((\d*)|ENCOUNTER_START|ENCOUNTER_END),/gm.test(line))

    if(lines[0].substring(0,4) != '0,0,'){
        console.log('invalid start')
        //invalid start
    }

    actions_element.innerHTML = '';
    init_element.querySelector('.action-pills').innerHTML = '';

    lines.forEach((line,index) => {
        let sections = line.split(',');
        let actions = sections.splice(3);
        actions = actions.map(a=>a.trim().split(':'))

        if(index==0){
            let trigger = document.querySelector('#initaction .trigger');
            trigger.querySelector(`input[name='desc']`).value = sections[2].replace(/\"/gi,'');
            actions.forEach(action => actionAdd(trigger.querySelector('.add-action-btn'), action))
        }else{
            let type = sections[0].includes('ENCOUNTER')?'Encounter '+(sections[0].includes('END')?'End':'Start'):'NPC Death';
            let props = [['desc',sections[2].replace(/\"/gi,'')]];
            if(type == 'NPC Death') props.push(...[['npc',sections[0]],['kills',sections[1]]])
            else props.push(...[['encounter',sections[1]]])
            addTrigger(type,props,actions)
        }
    })

    registermodal.hide()
},

insertUrlParam = (key, value) => {
    if (history.pushState) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
        return newurl
    }
},

removeUrlParameter = (paramKey) => {
    const url = window.location.href
    var r = new URL(url)
    r.searchParams.delete(paramKey)
    const newUrl = r.href
    window.history.pushState({ path: newUrl }, '', newUrl)
}

exportmodal.addEventListener('shown.bs.modal', event => {
    exportarea.focus()
    exportarea.select()
})

exportmodal.addEventListener('hidden.bs.modal', event => {
    document.querySelector('html').style.overflow = 'visible';
    exportarea.value = '';
    shareurl.value = '';
    exportarea.blur()
})

let drake  = dragula([actions_element],{
    invalid: function (el, handle) {
        return ['A','BUTTON','INPUT','SELECT'].includes(el.tagName);
    }
});

initOnLoad()

let params = new URL(document.location).searchParams;
let imp = params.get("i");
if(imp){
    try {
        let decodedimp = atob(imp)
        importText(decodedimp)
        removeUrlParameter("i")
    } catch (error) {
        removeUrlParameter("i")
    }
}