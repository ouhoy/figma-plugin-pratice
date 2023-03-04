figma.showUI(__html__)

figma.ui.resize(500, 500)

enum ImageVariants {
    NoImage = 1,
    SingleImage,
    Carousel
}

figma.ui.onmessage = pluginMessage => {

    console.log("Working!!")

    const {name, username, description, darkMode, imageVariant} = pluginMessage;

    const postComponentSet = figma.root.findOne(node => node.type == "COMPONENT_SET" && node.name == "post") as ComponentSetNode
    const defaultVariant = postComponentSet.defaultVariant as ComponentNode;
    const defaultDark = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=none, Dark mode=true") as ComponentNode

    let selectedVariant;

    if (darkMode) {
        switch (Number(imageVariant)) {
            case ImageVariants.SingleImage:
                selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=true") as ComponentNode
                break
            case ImageVariants.Carousel:
                selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=true") as ComponentNode
                break
            default:
                selectedVariant = defaultDark
                break
        }
    } else {
        switch (Number(imageVariant)) {
            case ImageVariants.SingleImage:
                selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=false") as ComponentNode
                break
            case ImageVariants.Carousel:
                selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=false") as ComponentNode
                break
            default:
                selectedVariant = defaultVariant
                break
        }
    }

    selectedVariant.createInstance()


    figma.closePlugin()
}