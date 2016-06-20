<?php

class Limelight_OneStepCheckout_Block_Onestep extends Mage_Checkout_Block_Onepage
{
    public function getSteps()
    {
        $steps = array();

        $stepCodes = array('billing', 'shipping', 'shipping_method', 'payment');

        foreach ($stepCodes as $step) {
            $steps[$step] = $this->getCheckout()->getStepData($step);
        }
        return $steps;
    }

}
