<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\SmartContent;

use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * Concrete Datasource item.
 */
#[ExclusionPolicy('all')]
class DatasourceItem implements DatasourceItemInterface
{
    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $title;

    /**
     * @var string
     */
    private $path;

    /**
     * @var string
     */
    private $image;

    public function __construct($id, $title, $path, $image = null)
    {
        $this->id = $id;
        $this->title = $title;
        $this->path = $path;
        $this->image = $image;
    }

    #[VirtualProperty]
    public function getId()
    {
        return $this->id;
    }

    #[VirtualProperty]
    public function getTitle()
    {
        return $this->title;
    }

    #[VirtualProperty]
    public function getPath()
    {
        return $this->path;
    }

    #[VirtualProperty]
    public function getImage()
    {
        return $this->image;
    }
}
