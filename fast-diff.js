function fastDiff(leftObj, rightObj)
{
    let leftObjDiff;
    let rightObjDiff;
    let objCommon;

    let hasLeftDiff = false;
    let hasRightDiff = false;
    let hasCommon = false;

    const leftObjKeys = Object.keys(leftObj);
    const rightObjKeys = Object.keys(rightObj);
    const leftValueConstructor = leftObj && leftObj.constructor || null;
    const rightValueConstructor = rightObj && rightObj.constructor || null;

    if (leftValueConstructor === rightValueConstructor && (leftValueConstructor === Object || leftValueConstructor === Array))
    {
        if (leftValueConstructor)
        {
            leftObjDiff = new leftValueConstructor();
            rightObjDiff = new leftValueConstructor();
            objCommon = new leftValueConstructor();
        }
        else
        {
            throw new Error('Only arrays and plain objects are allowed');
        }
    }
    else
    {
        return {
            leftDiff: leftObj,
            rightDiff: rightObj,
            common: null
        }
    }

    for (let i=0, l=leftObjKeys.length; i<l; i++)
    {
        const key = leftObjKeys[i];
        const valueLeft = leftObj[key];

        if (key in rightObj)
        {
            const valueRight = rightObj[key];

            if (typeof valueLeft !== 'object' && typeof valueRight !== 'object')
            {
                if (valueLeft === valueRight)
                {
                    objCommon[key] = valueLeft;
                    hasCommon = true;
                }
                else
                {
                    leftObjDiff[key] = valueLeft;
                    rightObjDiff[key] = valueRight;
                    hasLeftDiff = true;
                    hasRightDiff = true;
                }
            }
            else
            {
                const leftValueConstructor = valueLeft && valueLeft.constructor;
                const rightValueConstructor = valueRight && valueRight.constructor;

                if (leftValueConstructor === rightValueConstructor)
                {
                    if (!leftValueConstructor)
                    {
                        if (valueLeft === valueRight)
                        {
                            objCommon[key] = valueLeft;
                            hasCommon = true;
                        }
                        else
                        {
                            leftObjDiff[key] = valueLeft;
                            rightObjDiff[key] = valueRight;
                        }
                    }
                    else
                    {
                        switch (leftValueConstructor)
                        {
                            case Array:
                            case Object:
                                const recursiveResult = fastDiff(valueLeft, valueRight);

                                if (recursiveResult.leftDiff)
                                {
                                    leftObjDiff[key] = recursiveResult.leftDiff;
                                    hasLeftDiff = true;
                                }

                                if (recursiveResult.rightDiff)
                                {
                                    rightObjDiff[key] = recursiveResult.rightDiff;
                                    hasRightDiff = true;
                                }

                                if (recursiveResult.common)
                                {
                                    objCommon[key] = recursiveResult.common;
                                    hasCommon = true;
                                }
                                break;

                            default:
                                if (valueLeft.toString() === valueRight.toString())
                                {
                                    objCommon[key] = valueLeft;
                                    hasCommon = true;
                                }
                                else
                                {
                                    leftObjDiff[key] = valueLeft;
                                    rightObjDiff[key] = valueRight;
                                    hasLeftDiff = true;
                                    hasRightDiff = true;
                                }
                        }
                    }
                }
                else
                {
                    leftObjDiff[key] = valueLeft;
                    rightObjDiff[key] = valueRight;
                    hasLeftDiff = true;
                    hasRightDiff = true;
                }
            }

        }
        else
        {
            leftObjDiff[key] = valueLeft;
            hasLeftDiff = true;
        }
    }

    for (let i=0, l=rightObjKeys.length; i<l; i++)
    {
        const key = rightObjKeys[i];

        if (!(key in leftObj))
        {
            rightObjDiff[key] = rightObj[key];
            hasRightDiff = true;
        }
    }

    return {
        leftDiff: hasLeftDiff && leftObjDiff || null,
        rightDiff: hasRightDiff && rightObjDiff || null,
        common: hasCommon && objCommon || null
    }
}
