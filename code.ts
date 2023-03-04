figma.showUI(__html__)

figma.ui.resize(500, 500)

enum ImageVariants {
    NoImage = 1,
    SingleImage,
    Carousel
}

function componentSet(component: InstanceNode | DocumentNode | ComponentSetNode | ComponentNode, type: string, name: string) {
    return component.findOne(node => node.type == type && node.name == name)
}

figma.ui.onmessage = async pluginMessage => {

    const time = new Date();

    await figma.loadFontAsync({family: "Rubik", style: "Regular"})

    const {name, username, description, darkMode, imageVariant} = pluginMessage;

    const postComponentSet = componentSet(figma.root, "COMPONENT_SET", "post") as ComponentSetNode
    const defaultVariant = postComponentSet.defaultVariant as ComponentNode;
    const defaultDark = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=none, Dark mode=true") as ComponentNode

    let selectedVariant;

    if (darkMode) {
        switch (Number(imageVariant)) {
            case ImageVariants.SingleImage:
                selectedVariant = componentSet(postComponentSet, "COMPONENT", "Image=single, Dark mode=true") as ComponentNode
                break
            case ImageVariants.Carousel:
                selectedVariant = componentSet(postComponentSet, "COMPONENT", "Image=carousel, Dark mode=true") as ComponentNode
                break
            default:
                selectedVariant = defaultDark
                break
        }
    } else {
        switch (Number(imageVariant)) {
            case ImageVariants.SingleImage:
                selectedVariant = componentSet(postComponentSet, "COMPONENT", "Image=single, Dark mode=false") as ComponentNode
                break
            case ImageVariants.Carousel:
                selectedVariant = componentSet(postComponentSet, "COMPONENT", "Image=carousel, Dark mode=false") as ComponentNode
                break
            default:
                selectedVariant = defaultVariant
                break
        }
    }


    const newPost = selectedVariant.createInstance()

    const templateName = componentSet(newPost, "TEXT", "displayName") as TextNode
    const templateUsername = componentSet(newPost, "TEXT", "@username") as TextNode
    const templateDescription = componentSet(newPost, "TEXT", "description") as TextNode
    const numLikes = componentSet(newPost, "TEXT", "likesLabel") as TextNode
    const numComments = componentSet(newPost, "TEXT", "commentsLabel") as TextNode
    const timeStamp = componentSet(newPost, "TEXT", "timestamp") as TextNode
    const dateStamp = componentSet(newPost, "TEXT", "datestamp") as TextNode


    templateName.characters = name;
    templateUsername.characters = `@${username}`;
    templateDescription.characters = description;
    numLikes.characters = (Math.floor(Math.random() * 1000) + 1).toString()
    numComments.characters = (Math.floor(Math.random() * 1000) + 1).toString()
    timeStamp.characters = time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    dateStamp.characters = time.toLocaleString('en-US', {month: "short", day: "numeric", year: "numeric"})


    figma.closePlugin()
}