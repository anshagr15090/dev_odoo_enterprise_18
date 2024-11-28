from odoo import models, fields, api


class BSMSContact(models.Model):
    _name = 'bsms.contact'
 
    _description = 'BSMS Contact'


    is_patient = fields.Boolean(string="Is Patient")
    is_donor = fields.Boolean(string="Is Donor")

class BSMSDonorType(models.Model):
    _name = 'bsms.donor.type'

    name=fields.Char(string="Donor", required=True)
    