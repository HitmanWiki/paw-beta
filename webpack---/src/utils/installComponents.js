export default function(components) {
    return (Vue) => {
        for (const component of Object.values(components)) {
            const componentName = component.extendOptions ? .name || component.name
            if (componentName) {
                Vue.component(componentName, Vue.extend(component))
            }
        }
    }
}