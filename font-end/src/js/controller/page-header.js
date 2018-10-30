import pageHeader_template from '../views/page-header.html'

const render = (data = {
    title: '',
    description: '',
    list: []
}) => {
    console.log(data);
    let _html = template.render(pageHeader_template, data)
    $('#page-header').html(_html)
}

export default {
    render
}