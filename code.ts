figma.showUI(__html__)

figma.ui.resize(500, 500)

enum ImageVariants {
    NoImage = 1,
    SingleImage,
    Carousel
}

figma.ui.onmessage = async pluginMessage => {

    const time = new Date();

    await figma.loadFontAsync({family: "Rubik", style: "Regular"})

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

    const newPost = selectedVariant.createInstance()

    const templateName = newPost.findOne(node => node.type == "TEXT" && node.name == "displayName") as TextNode
    const templateUsername = newPost.findOne(node => node.type == "TEXT" && node.name == "@username") as TextNode
    const templateDescription = newPost.findOne(node => node.type == "TEXT" && node.name == "description") as TextNode
    const numLikes = newPost.findOne(node => node.type == "TEXT" && node.name == "likesLabel") as TextNode
    const numComments = newPost.findOne(node => node.type == "TEXT" && node.name == "commentsLabel") as TextNode
    const timeStamp = newPost.findOne(node => node.type == "TEXT" && node.name == "timestamp") as TextNode
    const dateStamp = newPost.findOne(node => node.type == "TEXT" && node.name == "datestamp") as TextNode


    templateName.characters = name;
    templateUsername.characters = username;
    templateDescription.characters = description;
    numLikes.characters = (Math.floor(Math.random() * 1000) + 1).toString()
    numComments.characters = (Math.floor(Math.random() * 1000) + 1).toString()
    timeStamp.characters = time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    dateStamp.characters = time.toLocaleString('en-US', {month: "short", day: "numeric", year: "numeric"})


    figma.closePlugin()
}